import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useApolloClient, gql } from '@apollo/client';
import { ChatHeader } from './ChatHeader';
import { MessageList, type Message } from './MessageList';
import { MessageComposer } from './MessageComposer';
import { GET_MESSAGES } from '../graphql/chat.queries';
import { SEND_MESSAGE_MUTATION } from '../graphql/chat.mutations';
import { useAuth } from '../../auth/hooks/useAuth';
import type { MentionUser } from '../hooks/useMentions';

const MESSAGE_FRAGMENT = gql`
  fragment ChatMessage on Message {
    id
    conversationId
    body
    type
    createdAt
    updatedAt
    sender {
      id
      name
      username
      avatarUrl
    }
    quoteMessage {
      id
      body
      type
      createdAt
      sender {
        id
        name
      }
    }
    mentions {
      id
      name
    }
  }
`;

// ---------------------------------------------------------------------------
// GraphQL response types
// ---------------------------------------------------------------------------

interface MessagesData {
  messages: {
    nodes: Message[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      endCursor: string | null;
      startCursor: string | null;
    };
  };
}

interface SendMessageData {
  sendMessage: {
    message: Message;
    conversation: {
      id: string;
      updatedAt: string;
    };
  };
}

interface SendMessageVars {
  input: {
    conversationId: string;
    body: string;
    quoteMessageId?: string;
    mentionUserIds: string[];
  };
}

// ---------------------------------------------------------------------------
// Quoted message (for reply)
// ---------------------------------------------------------------------------

interface QuotedMessage {
  id: string;
  sender: { name: string };
  body: string;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ChatPanelProps {
  conversationId: string;
  conversationName: string;
  memberCount?: number;
  members: MentionUser[];
  initialUnreadCount: number;
}

// ---------------------------------------------------------------------------
// Cache helpers
// ---------------------------------------------------------------------------

function addMessageToCache(
  client: ReturnType<typeof useApolloClient>,
  message: Message,
) {
  const cache = client.cache;
  const cacheId = cache.identify({ __typename: 'Message', id: message.id });
  if (!cacheId) return;

  cache.writeFragment({
    id: cacheId,
    fragment: MESSAGE_FRAGMENT,
    data: message,
  });

  cache.modify({
    id: 'ROOT_QUERY',
    fields: {
      messages(existing) {
        if (!existing?.nodes) return existing;
        const messageRef = { __ref: cacheId };
        const alreadyInList = existing.nodes.some(
          (ref: { __ref: string }) => ref.__ref === cacheId,
        );
        if (alreadyInList) return existing;
        return { ...existing, nodes: [...existing.nodes, messageRef] };
      },
    },
  });
}

function removeMessageFromCache(
  client: ReturnType<typeof useApolloClient>,
  messageId: string,
) {
  const cache = client.cache;
  const cacheId = cache.identify({ __typename: 'Message', id: messageId });
  if (cacheId) {
    cache.evict({ id: cacheId });
    cache.gc();
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ChatPanel({
  conversationId,
  conversationName,
  memberCount,
  members,
  initialUnreadCount,
}: ChatPanelProps) {
  const { user } = useAuth();
  const currentUserId = user?.id ?? '';
  const client = useApolloClient();

  const [quotedMessage, setQuotedMessage] = useState<QuotedMessage | null>(
    null,
  );
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const { data: messagesData } = useQuery<MessagesData>(GET_MESSAGES, {
    variables: { conversationId, last: 50 },
    skip: !conversationId,
  });

  useEffect(() => {
    setHasMoreMessages(messagesData?.messages.pageInfo.hasPreviousPage ?? true);
    setLoadingMore(false);
  }, [conversationId, messagesData?.messages.pageInfo.hasPreviousPage]);

  const messages = messagesData?.messages.nodes ?? [];

  const [sendMessage] = useMutation<SendMessageData, SendMessageVars>(
    SEND_MESSAGE_MUTATION,
  );

  const handleLoadMore = useCallback(async () => {
    if (!hasMoreMessages || loadingMore || messages.length === 0) return;

    setLoadingMore(true);
    try {
      const oldestId = messages[0].id;
      const { data } = await client.query<MessagesData>({
        query: GET_MESSAGES,
        variables: { conversationId, first: 50, before: oldestId },
        fetchPolicy: 'network-only',
      });

      const olderNodes = data.messages.nodes;
      if (!data.messages.pageInfo.hasPreviousPage) {
        setHasMoreMessages(false);
      }

      if (olderNodes.length > 0) {
        const cache = client.cache;
        // Prepend older messages to the cached list for the main query
        cache.modify({
          id: 'ROOT_QUERY',
          fields: {
            messages(existing) {
              if (!existing?.nodes) return existing;
              const existingIds = new Set(
                existing.nodes.map((ref: { __ref: string }) => ref.__ref),
              );
              const newRefs = olderNodes
                .map((msg) => {
                  const cid = cache.identify({ __typename: 'Message', id: msg.id });
                  if (cid) {
                    cache.writeFragment({
                      id: cid,
                      fragment: MESSAGE_FRAGMENT,
                      data: msg,
                    });
                    return { __ref: cid };
                  }
                  return null;
                })
                .filter(
                  (ref): ref is { __ref: string } =>
                    ref !== null && !existingIds.has(ref.__ref),
                );

              if (newRefs.length === 0) return existing;
              return { ...existing, nodes: [...newRefs, ...existing.nodes] };
            },
          },
        });
      }
    } catch (err) {
      console.warn('[ChatPanel] Failed to load older messages:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [client, conversationId, hasMoreMessages, loadingMore, messages]);

  const handleClearQuote = useCallback(() => {
    setQuotedMessage(null);
  }, []);

  const handleSend = useCallback(
    async (input: {
      body: string;
      conversationId: string;
      quoteMessageId?: string;
      mentionUserIds: string[];
    }) => {
      console.log('[ChatPanel] Sending message:', {
        conversationId: input.conversationId,
        body: input.body,
      });

      const tempId = `temp-${Date.now()}`;
      const optimisticMessage: Message = {
        id: tempId,
        conversationId: input.conversationId,
        body: input.body,
        type: 'TEXT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sender: {
          id: currentUserId,
          name: user?.name ?? '',
          username: user?.username ?? '',
          avatarUrl: user?.avatarUrl ?? null,
        },
        quoteMessage: quotedMessage
          ? {
              id: quotedMessage.id,
              body: quotedMessage.body,
              type: 'TEXT',
              createdAt: new Date().toISOString(),
              sender: { id: '', name: quotedMessage.sender.name },
            }
          : null,
        mentions: input.mentionUserIds.map((id) => ({
          id,
          name: members.find((m) => m.id === id)?.name ?? '',
        })),
      };

      addMessageToCache(client, optimisticMessage);

      try {
        const { data: result } = await sendMessage({
          variables: {
            input: {
              conversationId: input.conversationId,
              body: input.body,
              quoteMessageId: input.quoteMessageId,
              mentionUserIds: input.mentionUserIds,
            },
          },
        });

        if (result?.sendMessage.message) {
          console.log('[ChatPanel] Message sent successfully:', {
            id: result.sendMessage.message.id,
            body: result.sendMessage.message.body,
          });
          removeMessageFromCache(client, tempId);
          addMessageToCache(client, result.sendMessage.message);
        }
        setQuotedMessage(null);
      } catch (err) {
        removeMessageFromCache(client, tempId);
        console.error('Failed to send message:', err);
      }
    },
    [sendMessage, client, currentUserId, user, members, quotedMessage],
  );

  return (
    <div className="flex h-full w-full flex-col bg-chat-bg border-l border-border">
      {/* Header */}
      <ChatHeader
        conversationName={conversationName}
        memberCount={memberCount}
      />

      {/* Messages */}
      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        initialUnreadCount={initialUnreadCount}
        hasMore={hasMoreMessages}
        loadingMore={loadingMore}
        onLoadMore={handleLoadMore}
      />

      {/* Composer */}
      <MessageComposer
        conversationId={conversationId}
        quotedMessage={quotedMessage}
        onClearQuote={handleClearQuote}
        members={members}
        onSend={handleSend}
      />
    </div>
  );
}

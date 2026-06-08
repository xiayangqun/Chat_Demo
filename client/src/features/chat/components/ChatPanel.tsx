import { useState, useCallback } from 'react';
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
      endCursor: string | null;
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

interface ChatPanelProps {
  conversationId: string;
  conversationName: string;
  memberCount?: number;
  members: MentionUser[];
}

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
// Props
// ---------------------------------------------------------------------------

interface ChatPanelProps {
  conversationId: string;
  conversationName: string;
  memberCount?: number;
  members: MentionUser[];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ChatPanel({
  conversationId,
  conversationName,
  memberCount,
  members,
}: ChatPanelProps) {
  const { user } = useAuth();
  const currentUserId = user?.id ?? '';
  const client = useApolloClient();

  const [quotedMessage, setQuotedMessage] = useState<QuotedMessage | null>(
    null,
  );

  const { data: messagesData } = useQuery<MessagesData>(GET_MESSAGES, {
    variables: { conversationId, first: 50 },
    skip: !conversationId,
  });

  const messages = messagesData?.messages.nodes ?? [];

  const [sendMessage] = useMutation<SendMessageData, SendMessageVars>(
    SEND_MESSAGE_MUTATION,
  );

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
    <div className="flex h-full w-full flex-col bg-chat-bg">
      {/* Header */}
      <ChatHeader
        conversationName={conversationName}
        memberCount={memberCount}
      />

      {/* Messages */}
      <MessageList messages={messages} currentUserId={currentUserId} />

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

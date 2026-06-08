import { useEffect } from 'react';
import { useApolloClient, gql } from '@apollo/client';
import type { Reference } from '@apollo/client';
import { useSocket } from '../../../shared/hooks/useSocket';
import { decodeRealtimeEvent } from '../../../shared/utils/protobuf';
import { MARK_CONVERSATION_READ } from '../graphql/chat.mutations';
import {
  mapProtoMessageToGql,
  mapProtoConversationToGql,
} from '../utils/mapRealtimeEvent';

// ---------------------------------------------------------------------------
// Fragments used to read / write normalised cache entries
// ---------------------------------------------------------------------------

const MESSAGE_FRAGMENT = gql`
  fragment SocketMessage on Message {
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

const CONVERSATION_FRAGMENT = gql`
  fragment SocketConversation on Conversation {
    id
    name
    type
    avatarUrls
    memberCount
    unreadCount
    mentionCount
    lastMessage {
      id
      body
      createdAt
      sender {
        id
        name
      }
    }
    createdAt
    updatedAt
  }
`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Apollo Client encodes field arguments into the storeFieldName as
 * `"fieldName:{json}"`.  This helper extracts the JSON args when present.
 */
function parseStoreFieldArgs(
  storeFieldName: string,
): Record<string, unknown> | null {
  if (storeFieldName.startsWith('messages(') && storeFieldName.endsWith(')')) {
    const jsonStr = storeFieldName.slice(9, -1);
    try {
      return JSON.parse(jsonStr) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
  const idx = storeFieldName.indexOf(':');
  if (idx === -1) return null;
  try {
    return JSON.parse(storeFieldName.slice(idx + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

let currentConversationId: string | null = null;

export function setCurrentConversationId(id: string | null) {
  currentConversationId = id;
}

// ---------------------------------------------------------------------------
// useChatSocket
// ---------------------------------------------------------------------------

/**
 * Sets up global Socket.IO listeners for real-time events and keeps the
 * Apollo cache in sync.  Also exposes helpers for joining / leaving
 * conversation rooms.
 *
 * Mount once at the AppShell level.
 */
export function useChatSocket() {
  const socket = useSocket();
  const client = useApolloClient();

  useEffect(() => {
    if (!socket) return;

    const { cache } = client;

    // message.created --------------------------------------------------
    function handleMessageCreated(data: unknown) {
      try {
        const raw = decodeRealtimeEvent(data);
        const payload = raw.messageCreated;
        if (!payload?.message) return;

        const gqlMessage = mapProtoMessageToGql(payload.message);
        console.log('[Socket] message.created received:', {
          id: gqlMessage.id,
          conversationId: gqlMessage.conversationId,
          body: gqlMessage.body,
          sender: gqlMessage.sender.name,
        });
        const cacheId = cache.identify({
          __typename: 'Message',
          id: gqlMessage.id,
        });
        if (!cacheId) return;

        const alreadyCached = cache.readFragment({
          id: cacheId,
          fragment: MESSAGE_FRAGMENT,
        });
        if (alreadyCached) return;

        cache.writeFragment({
          id: cacheId,
          fragment: MESSAGE_FRAGMENT,
          data: gqlMessage,
        });

        const conversationId = gqlMessage.conversationId;

        if (currentConversationId === conversationId) {
          client.mutate({
            mutation: MARK_CONVERSATION_READ,
            variables: { conversationId },
            optimisticResponse: {
              markConversationRead: {
                __typename: 'Conversation',
                id: conversationId,
                unreadCount: 0,
                updatedAt: new Date().toISOString(),
              },
            },
          }).catch(() => {});
        } else {
          const convCacheId = cache.identify({
            __typename: 'Conversation',
            id: conversationId,
          });
          if (convCacheId) {
            cache.modify({
              id: convCacheId,
              fields: {
                unreadCount: (existing: number) => (existing ?? 0) + 1,
              },
            });
          }
        }

        cache.modify({
          id: 'ROOT_QUERY',
          fields: {
            messages(existing, { storeFieldName, toReference, readField }) {
              const args = parseStoreFieldArgs(storeFieldName);
              if (!args || args.conversationId !== conversationId) {
                return existing;
              }
              if (!existing?.nodes) return existing;

              const messageRef = toReference({
                __typename: 'Message',
                id: gqlMessage.id,
              });
              if (!messageRef) return existing;

              const nodes: Reference[] = existing.nodes;
              const alreadyInList = nodes.some(
                (ref) => readField<string>('id', ref) === gqlMessage.id,
              );
              if (alreadyInList) return existing;

              return {
                ...existing,
                nodes: [...nodes, messageRef],
              };
            },
            conversations(existing, { readField }) {
              if (!existing) return existing;
              const list = [...existing] as Reference[];

              const convRef = list.find(
                (ref) => readField<string>('id', ref) === conversationId,
              );
              if (convRef) {
                cache.modify({
                  id: cache.identify({ __typename: 'Conversation', id: conversationId })!,
                  fields: {
                    lastMessage: () => ({
                      __typename: 'MessagePreview',
                      id: gqlMessage.id,
                      body: gqlMessage.body,
                      createdAt: gqlMessage.createdAt,
                      sender: {
                        __typename: 'User',
                        id: gqlMessage.sender.id,
                        name: gqlMessage.sender.name,
                      },
                    }),
                    updatedAt: () => gqlMessage.createdAt,
                  },
                });
              }

              list.sort((a: Reference, b: Reference) => {
                const aTime = readField<string>('updatedAt', a);
                const bTime = readField<string>('updatedAt', b);
                if (!aTime && !bTime) return 0;
                if (!aTime) return 1;
                if (!bTime) return -1;
                return bTime.localeCompare(aTime);
              });
              return list;
            },
          },
        });
      } catch (err) {
        console.warn('[useChatSocket] Failed to handle message.created:', err);
      }
    }

    // conversation.created ---------------------------------------------
    function handleConversationCreated(data: unknown) {
      try {
        const raw = decodeRealtimeEvent(data);
        const payload = raw.conversationCreated;
        if (!payload?.conversation) return;

        const gqlConversation = mapProtoConversationToGql(payload.conversation);
        console.log('[Socket] conversation.created received:', {
          id: gqlConversation.id,
          name: gqlConversation.name,
          type: gqlConversation.type,
        });
        const cacheId = cache.identify({
          __typename: 'Conversation',
          id: gqlConversation.id,
        });
        if (!cacheId) return;

        // Dedup: skip if conversation already exists in cache
        const alreadyCached = cache.readFragment({
          id: cacheId,
          fragment: CONVERSATION_FRAGMENT,
        });
        if (alreadyCached) return;

        // Write conversation to the normalised cache
        cache.writeFragment({
          id: cacheId,
          fragment: CONVERSATION_FRAGMENT,
          data: gqlConversation,
        });

        // Prepend to the conversations list
        cache.modify({
          id: 'ROOT_QUERY',
          fields: {
            conversations(existing, { toReference, readField }) {
              const list: readonly Reference[] = Array.isArray(existing)
                ? existing
                : [];

              const newRef = toReference({
                __typename: 'Conversation',
                id: gqlConversation.id,
              });
              if (!newRef) return existing;

              // Dedup within the list
              const alreadyInList = list.some(
                (ref) => readField<string>('id', ref) === gqlConversation.id,
              );
              if (alreadyInList) return existing;

              return [newRef, ...list];
            },
          },
        });
      } catch (err) {
        console.warn(
          '[useChatSocket] Failed to handle conversation.created:',
          err,
        );
      }
    }

    // conversation.updated ---------------------------------------------
    function handleConversationUpdated(data: unknown) {
      try {
        const raw = decodeRealtimeEvent(data);
        const payload = raw.conversationUpdated;
        if (!payload?.conversation) return;

        const gqlConversation = mapProtoConversationToGql(payload.conversation);
        const convRef = cache.identify({
          __typename: 'Conversation',
          id: gqlConversation.id,
        });
        if (!convRef) return;

        cache.modify({
          id: convRef,
          fields: {
            lastMessage: (existing) =>
              gqlConversation.lastMessage ?? existing,
            unreadCount: () => gqlConversation.unreadCount,
            mentionCount: () => gqlConversation.mentionCount,
            updatedAt: () => gqlConversation.updatedAt,
          },
        });

        cache.modify({
          id: 'ROOT_QUERY',
          fields: {
            conversations(existing, { readField }) {
              if (!existing) return existing;
              const list = [...existing] as Reference[];
              list.sort((a: Reference, b: Reference) => {
                const aTime = readField<string>('updatedAt', a);
                const bTime = readField<string>('updatedAt', b);
                if (!aTime && !bTime) return 0;
                if (!aTime) return 1;
                if (!bTime) return -1;
                return bTime.localeCompare(aTime);
              });
              return list;
            },
          },
        });
      } catch (err) {
        console.warn(
          '[useChatSocket] Failed to handle conversation.updated:',
          err,
        );
      }
    }

    // -- Register / unregister listeners -------------------------------
    socket.on('message.created', handleMessageCreated);
    socket.on('conversation.created', handleConversationCreated);
    socket.on('conversation.updated', handleConversationUpdated);

    return () => {
      socket.off('message.created', handleMessageCreated);
      socket.off('conversation.created', handleConversationCreated);
      socket.off('conversation.updated', handleConversationUpdated);
    };
  }, [socket, client]);

  return {};
}

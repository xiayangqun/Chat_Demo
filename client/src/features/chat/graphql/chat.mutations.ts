import { gql } from '@apollo/client';

export const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      message {
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
      conversation {
        id
        updatedAt
      }
    }
  }
`;

export const CREATE_GROUP_CONVERSATION_MUTATION = gql`
  mutation CreateGroupConversation($input: CreateGroupConversationInput!) {
    createGroupConversation(input: $input) {
      id
      name
      type
      avatarUrls
      memberCount
      unreadCount
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
  }
`;

export const CREATE_DIRECT_CONVERSATION_MUTATION = gql`
  mutation CreateDirectConversation($input: CreateDirectConversationInput!) {
    createDirectConversation(input: $input) {
      id
      name
      type
      avatarUrls
      memberCount
      unreadCount
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
  }
`;

export const MARK_CONVERSATION_READ = gql`
  mutation MarkConversationRead($conversationId: ID!) {
    markConversationRead(conversationId: $conversationId) {
      id
      unreadCount
      updatedAt
    }
  }
`;

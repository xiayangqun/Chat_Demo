import { gql } from '@apollo/client';

export const GET_CONVERSATIONS = gql`
  query GetConversations {
    conversations {
      id
      name
      type
      avatarUrls
      unreadCount
      mentionCount
      members {
        id
        name
        username
      }
      lastMessage {
        id
        body
        sender {
          id
          name
        }
        createdAt
      }
      updatedAt
    }
  }
`;

export const GET_MESSAGES = gql`
  query GetMessages($conversationId: ID!, $first: Int, $after: String) {
    messages(conversationId: $conversationId, first: $first, after: $after) {
      nodes {
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
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers($query: String, $limit: Int, $skip: Int) {
    users(query: $query, limit: $limit, skip: $skip) {
      id
      username
      name
      avatarUrl
      title
    }
  }
`;

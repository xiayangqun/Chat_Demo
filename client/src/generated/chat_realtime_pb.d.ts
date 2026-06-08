import * as $protobuf from "protobufjs";
/** Namespace chat. */
export namespace chat {

    /** Namespace realtime. */
    export namespace realtime {

        /** Namespace v1. */
        export namespace v1 {

            /** RealtimeEventType enum. */
            enum RealtimeEventType {
                REALTIME_EVENT_TYPE_UNSPECIFIED = 0,
                MESSAGE_CREATED = 1,
                CONVERSATION_CREATED = 2,
                CONVERSATION_UPDATED = 3,
                TYPING_UPDATED = 4
            }

            /** ConversationType enum. */
            enum ConversationType {
                CONVERSATION_TYPE_UNSPECIFIED = 0,
                GROUP = 1,
                DIRECT = 2
            }

            /** MessageType enum. */
            enum MessageType {
                MESSAGE_TYPE_UNSPECIFIED = 0,
                TEXT = 1
            }

            /** Properties of a User. */
            interface IUser {

                /** User id */
                id?: (string|null);

                /** User username */
                username?: (string|null);

                /** User name */
                name?: (string|null);

                /** User avatarUrl */
                avatarUrl?: (string|null);

                /** User title */
                title?: (string|null);
            }

            /** Represents a User. */
            class User implements IUser {

                /**
                 * Constructs a new User.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: chat.realtime.v1.IUser);

                /** User id. */
                public id: string;

                /** User username. */
                public username: string;

                /** User name. */
                public name: string;

                /** User avatarUrl. */
                public avatarUrl?: (string|null);

                /** User title. */
                public title?: (string|null);

                /**
                 * Creates a new User instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns User instance
                 */
                public static create(properties?: chat.realtime.v1.IUser): chat.realtime.v1.User;

                /**
                 * Encodes the specified User message. Does not implicitly {@link chat.realtime.v1.User.verify|verify} messages.
                 * @param message User message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: chat.realtime.v1.IUser, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified User message, length delimited. Does not implicitly {@link chat.realtime.v1.User.verify|verify} messages.
                 * @param message User message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: chat.realtime.v1.IUser, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a User message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns User
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.realtime.v1.User;

                /**
                 * Decodes a User message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns User
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.realtime.v1.User;

                /**
                 * Verifies a User message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a User message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns User
                 */
                public static fromObject(object: { [k: string]: any }): chat.realtime.v1.User;

                /**
                 * Creates a plain object from a User message. Also converts values to other types if specified.
                 * @param message User
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: chat.realtime.v1.User, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this User to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for User
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a MessagePreview. */
            interface IMessagePreview {

                /** MessagePreview id */
                id?: (string|null);

                /** MessagePreview conversationId */
                conversationId?: (string|null);

                /** MessagePreview sender */
                sender?: (chat.realtime.v1.IUser|null);

                /** MessagePreview body */
                body?: (string|null);

                /** MessagePreview type */
                type?: (chat.realtime.v1.MessageType|null);

                /** MessagePreview createdAt */
                createdAt?: (string|null);
            }

            /** Represents a MessagePreview. */
            class MessagePreview implements IMessagePreview {

                /**
                 * Constructs a new MessagePreview.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: chat.realtime.v1.IMessagePreview);

                /** MessagePreview id. */
                public id: string;

                /** MessagePreview conversationId. */
                public conversationId: string;

                /** MessagePreview sender. */
                public sender?: (chat.realtime.v1.IUser|null);

                /** MessagePreview body. */
                public body: string;

                /** MessagePreview type. */
                public type: chat.realtime.v1.MessageType;

                /** MessagePreview createdAt. */
                public createdAt: string;

                /**
                 * Creates a new MessagePreview instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns MessagePreview instance
                 */
                public static create(properties?: chat.realtime.v1.IMessagePreview): chat.realtime.v1.MessagePreview;

                /**
                 * Encodes the specified MessagePreview message. Does not implicitly {@link chat.realtime.v1.MessagePreview.verify|verify} messages.
                 * @param message MessagePreview message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: chat.realtime.v1.IMessagePreview, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified MessagePreview message, length delimited. Does not implicitly {@link chat.realtime.v1.MessagePreview.verify|verify} messages.
                 * @param message MessagePreview message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: chat.realtime.v1.IMessagePreview, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a MessagePreview message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns MessagePreview
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.realtime.v1.MessagePreview;

                /**
                 * Decodes a MessagePreview message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns MessagePreview
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.realtime.v1.MessagePreview;

                /**
                 * Verifies a MessagePreview message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a MessagePreview message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns MessagePreview
                 */
                public static fromObject(object: { [k: string]: any }): chat.realtime.v1.MessagePreview;

                /**
                 * Creates a plain object from a MessagePreview message. Also converts values to other types if specified.
                 * @param message MessagePreview
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: chat.realtime.v1.MessagePreview, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this MessagePreview to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for MessagePreview
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a MessageQuote. */
            interface IMessageQuote {

                /** MessageQuote id */
                id?: (string|null);

                /** MessageQuote sender */
                sender?: (chat.realtime.v1.IUser|null);

                /** MessageQuote body */
                body?: (string|null);

                /** MessageQuote type */
                type?: (chat.realtime.v1.MessageType|null);

                /** MessageQuote createdAt */
                createdAt?: (string|null);
            }

            /** Represents a MessageQuote. */
            class MessageQuote implements IMessageQuote {

                /**
                 * Constructs a new MessageQuote.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: chat.realtime.v1.IMessageQuote);

                /** MessageQuote id. */
                public id: string;

                /** MessageQuote sender. */
                public sender?: (chat.realtime.v1.IUser|null);

                /** MessageQuote body. */
                public body: string;

                /** MessageQuote type. */
                public type: chat.realtime.v1.MessageType;

                /** MessageQuote createdAt. */
                public createdAt: string;

                /**
                 * Creates a new MessageQuote instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns MessageQuote instance
                 */
                public static create(properties?: chat.realtime.v1.IMessageQuote): chat.realtime.v1.MessageQuote;

                /**
                 * Encodes the specified MessageQuote message. Does not implicitly {@link chat.realtime.v1.MessageQuote.verify|verify} messages.
                 * @param message MessageQuote message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: chat.realtime.v1.IMessageQuote, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified MessageQuote message, length delimited. Does not implicitly {@link chat.realtime.v1.MessageQuote.verify|verify} messages.
                 * @param message MessageQuote message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: chat.realtime.v1.IMessageQuote, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a MessageQuote message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns MessageQuote
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.realtime.v1.MessageQuote;

                /**
                 * Decodes a MessageQuote message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns MessageQuote
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.realtime.v1.MessageQuote;

                /**
                 * Verifies a MessageQuote message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a MessageQuote message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns MessageQuote
                 */
                public static fromObject(object: { [k: string]: any }): chat.realtime.v1.MessageQuote;

                /**
                 * Creates a plain object from a MessageQuote message. Also converts values to other types if specified.
                 * @param message MessageQuote
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: chat.realtime.v1.MessageQuote, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this MessageQuote to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for MessageQuote
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Message. */
            interface IMessage {

                /** Message id */
                id?: (string|null);

                /** Message conversationId */
                conversationId?: (string|null);

                /** Message sender */
                sender?: (chat.realtime.v1.IUser|null);

                /** Message type */
                type?: (chat.realtime.v1.MessageType|null);

                /** Message body */
                body?: (string|null);

                /** Message quoteMessage */
                quoteMessage?: (chat.realtime.v1.IMessageQuote|null);

                /** Message mentions */
                mentions?: (chat.realtime.v1.IUser[]|null);

                /** Message createdAt */
                createdAt?: (string|null);

                /** Message updatedAt */
                updatedAt?: (string|null);
            }

            /** Represents a Message. */
            class Message implements IMessage {

                /**
                 * Constructs a new Message.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: chat.realtime.v1.IMessage);

                /** Message id. */
                public id: string;

                /** Message conversationId. */
                public conversationId: string;

                /** Message sender. */
                public sender?: (chat.realtime.v1.IUser|null);

                /** Message type. */
                public type: chat.realtime.v1.MessageType;

                /** Message body. */
                public body: string;

                /** Message quoteMessage. */
                public quoteMessage?: (chat.realtime.v1.IMessageQuote|null);

                /** Message mentions. */
                public mentions: chat.realtime.v1.IUser[];

                /** Message createdAt. */
                public createdAt: string;

                /** Message updatedAt. */
                public updatedAt: string;

                /**
                 * Creates a new Message instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Message instance
                 */
                public static create(properties?: chat.realtime.v1.IMessage): chat.realtime.v1.Message;

                /**
                 * Encodes the specified Message message. Does not implicitly {@link chat.realtime.v1.Message.verify|verify} messages.
                 * @param message Message message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: chat.realtime.v1.IMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Message message, length delimited. Does not implicitly {@link chat.realtime.v1.Message.verify|verify} messages.
                 * @param message Message message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: chat.realtime.v1.IMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Message message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Message
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.realtime.v1.Message;

                /**
                 * Decodes a Message message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Message
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.realtime.v1.Message;

                /**
                 * Verifies a Message message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Message message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Message
                 */
                public static fromObject(object: { [k: string]: any }): chat.realtime.v1.Message;

                /**
                 * Creates a plain object from a Message message. Also converts values to other types if specified.
                 * @param message Message
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: chat.realtime.v1.Message, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Message to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Message
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Conversation. */
            interface IConversation {

                /** Conversation id */
                id?: (string|null);

                /** Conversation name */
                name?: (string|null);

                /** Conversation type */
                type?: (chat.realtime.v1.ConversationType|null);

                /** Conversation avatarUrls */
                avatarUrls?: (string[]|null);

                /** Conversation memberCount */
                memberCount?: (number|null);

                /** Conversation unreadCount */
                unreadCount?: (number|null);

                /** Conversation mentionCount */
                mentionCount?: (number|null);

                /** Conversation lastMessage */
                lastMessage?: (chat.realtime.v1.IMessagePreview|null);

                /** Conversation createdAt */
                createdAt?: (string|null);

                /** Conversation updatedAt */
                updatedAt?: (string|null);
            }

            /** Represents a Conversation. */
            class Conversation implements IConversation {

                /**
                 * Constructs a new Conversation.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: chat.realtime.v1.IConversation);

                /** Conversation id. */
                public id: string;

                /** Conversation name. */
                public name: string;

                /** Conversation type. */
                public type: chat.realtime.v1.ConversationType;

                /** Conversation avatarUrls. */
                public avatarUrls: string[];

                /** Conversation memberCount. */
                public memberCount: number;

                /** Conversation unreadCount. */
                public unreadCount: number;

                /** Conversation mentionCount. */
                public mentionCount: number;

                /** Conversation lastMessage. */
                public lastMessage?: (chat.realtime.v1.IMessagePreview|null);

                /** Conversation createdAt. */
                public createdAt: string;

                /** Conversation updatedAt. */
                public updatedAt: string;

                /**
                 * Creates a new Conversation instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Conversation instance
                 */
                public static create(properties?: chat.realtime.v1.IConversation): chat.realtime.v1.Conversation;

                /**
                 * Encodes the specified Conversation message. Does not implicitly {@link chat.realtime.v1.Conversation.verify|verify} messages.
                 * @param message Conversation message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: chat.realtime.v1.IConversation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Conversation message, length delimited. Does not implicitly {@link chat.realtime.v1.Conversation.verify|verify} messages.
                 * @param message Conversation message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: chat.realtime.v1.IConversation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Conversation message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Conversation
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.realtime.v1.Conversation;

                /**
                 * Decodes a Conversation message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Conversation
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.realtime.v1.Conversation;

                /**
                 * Verifies a Conversation message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Conversation message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Conversation
                 */
                public static fromObject(object: { [k: string]: any }): chat.realtime.v1.Conversation;

                /**
                 * Creates a plain object from a Conversation message. Also converts values to other types if specified.
                 * @param message Conversation
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: chat.realtime.v1.Conversation, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Conversation to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Conversation
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a MessageCreatedPayload. */
            interface IMessageCreatedPayload {

                /** MessageCreatedPayload message */
                message?: (chat.realtime.v1.IMessage|null);
            }

            /** Represents a MessageCreatedPayload. */
            class MessageCreatedPayload implements IMessageCreatedPayload {

                /**
                 * Constructs a new MessageCreatedPayload.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: chat.realtime.v1.IMessageCreatedPayload);

                /** MessageCreatedPayload message. */
                public message?: (chat.realtime.v1.IMessage|null);

                /**
                 * Creates a new MessageCreatedPayload instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns MessageCreatedPayload instance
                 */
                public static create(properties?: chat.realtime.v1.IMessageCreatedPayload): chat.realtime.v1.MessageCreatedPayload;

                /**
                 * Encodes the specified MessageCreatedPayload message. Does not implicitly {@link chat.realtime.v1.MessageCreatedPayload.verify|verify} messages.
                 * @param message MessageCreatedPayload message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: chat.realtime.v1.IMessageCreatedPayload, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified MessageCreatedPayload message, length delimited. Does not implicitly {@link chat.realtime.v1.MessageCreatedPayload.verify|verify} messages.
                 * @param message MessageCreatedPayload message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: chat.realtime.v1.IMessageCreatedPayload, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a MessageCreatedPayload message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns MessageCreatedPayload
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.realtime.v1.MessageCreatedPayload;

                /**
                 * Decodes a MessageCreatedPayload message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns MessageCreatedPayload
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.realtime.v1.MessageCreatedPayload;

                /**
                 * Verifies a MessageCreatedPayload message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a MessageCreatedPayload message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns MessageCreatedPayload
                 */
                public static fromObject(object: { [k: string]: any }): chat.realtime.v1.MessageCreatedPayload;

                /**
                 * Creates a plain object from a MessageCreatedPayload message. Also converts values to other types if specified.
                 * @param message MessageCreatedPayload
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: chat.realtime.v1.MessageCreatedPayload, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this MessageCreatedPayload to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for MessageCreatedPayload
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a ConversationCreatedPayload. */
            interface IConversationCreatedPayload {

                /** ConversationCreatedPayload conversation */
                conversation?: (chat.realtime.v1.IConversation|null);
            }

            /** Represents a ConversationCreatedPayload. */
            class ConversationCreatedPayload implements IConversationCreatedPayload {

                /**
                 * Constructs a new ConversationCreatedPayload.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: chat.realtime.v1.IConversationCreatedPayload);

                /** ConversationCreatedPayload conversation. */
                public conversation?: (chat.realtime.v1.IConversation|null);

                /**
                 * Creates a new ConversationCreatedPayload instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ConversationCreatedPayload instance
                 */
                public static create(properties?: chat.realtime.v1.IConversationCreatedPayload): chat.realtime.v1.ConversationCreatedPayload;

                /**
                 * Encodes the specified ConversationCreatedPayload message. Does not implicitly {@link chat.realtime.v1.ConversationCreatedPayload.verify|verify} messages.
                 * @param message ConversationCreatedPayload message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: chat.realtime.v1.IConversationCreatedPayload, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ConversationCreatedPayload message, length delimited. Does not implicitly {@link chat.realtime.v1.ConversationCreatedPayload.verify|verify} messages.
                 * @param message ConversationCreatedPayload message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: chat.realtime.v1.IConversationCreatedPayload, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ConversationCreatedPayload message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ConversationCreatedPayload
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.realtime.v1.ConversationCreatedPayload;

                /**
                 * Decodes a ConversationCreatedPayload message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ConversationCreatedPayload
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.realtime.v1.ConversationCreatedPayload;

                /**
                 * Verifies a ConversationCreatedPayload message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ConversationCreatedPayload message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ConversationCreatedPayload
                 */
                public static fromObject(object: { [k: string]: any }): chat.realtime.v1.ConversationCreatedPayload;

                /**
                 * Creates a plain object from a ConversationCreatedPayload message. Also converts values to other types if specified.
                 * @param message ConversationCreatedPayload
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: chat.realtime.v1.ConversationCreatedPayload, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ConversationCreatedPayload to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for ConversationCreatedPayload
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a ConversationUpdatedPayload. */
            interface IConversationUpdatedPayload {

                /** ConversationUpdatedPayload conversation */
                conversation?: (chat.realtime.v1.IConversation|null);
            }

            /** Represents a ConversationUpdatedPayload. */
            class ConversationUpdatedPayload implements IConversationUpdatedPayload {

                /**
                 * Constructs a new ConversationUpdatedPayload.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: chat.realtime.v1.IConversationUpdatedPayload);

                /** ConversationUpdatedPayload conversation. */
                public conversation?: (chat.realtime.v1.IConversation|null);

                /**
                 * Creates a new ConversationUpdatedPayload instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ConversationUpdatedPayload instance
                 */
                public static create(properties?: chat.realtime.v1.IConversationUpdatedPayload): chat.realtime.v1.ConversationUpdatedPayload;

                /**
                 * Encodes the specified ConversationUpdatedPayload message. Does not implicitly {@link chat.realtime.v1.ConversationUpdatedPayload.verify|verify} messages.
                 * @param message ConversationUpdatedPayload message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: chat.realtime.v1.IConversationUpdatedPayload, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ConversationUpdatedPayload message, length delimited. Does not implicitly {@link chat.realtime.v1.ConversationUpdatedPayload.verify|verify} messages.
                 * @param message ConversationUpdatedPayload message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: chat.realtime.v1.IConversationUpdatedPayload, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ConversationUpdatedPayload message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ConversationUpdatedPayload
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.realtime.v1.ConversationUpdatedPayload;

                /**
                 * Decodes a ConversationUpdatedPayload message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ConversationUpdatedPayload
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.realtime.v1.ConversationUpdatedPayload;

                /**
                 * Verifies a ConversationUpdatedPayload message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ConversationUpdatedPayload message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ConversationUpdatedPayload
                 */
                public static fromObject(object: { [k: string]: any }): chat.realtime.v1.ConversationUpdatedPayload;

                /**
                 * Creates a plain object from a ConversationUpdatedPayload message. Also converts values to other types if specified.
                 * @param message ConversationUpdatedPayload
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: chat.realtime.v1.ConversationUpdatedPayload, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ConversationUpdatedPayload to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for ConversationUpdatedPayload
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a TypingUpdatedPayload. */
            interface ITypingUpdatedPayload {

                /** TypingUpdatedPayload conversationId */
                conversationId?: (string|null);

                /** TypingUpdatedPayload user */
                user?: (chat.realtime.v1.IUser|null);

                /** TypingUpdatedPayload isTyping */
                isTyping?: (boolean|null);
            }

            /** Represents a TypingUpdatedPayload. */
            class TypingUpdatedPayload implements ITypingUpdatedPayload {

                /**
                 * Constructs a new TypingUpdatedPayload.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: chat.realtime.v1.ITypingUpdatedPayload);

                /** TypingUpdatedPayload conversationId. */
                public conversationId: string;

                /** TypingUpdatedPayload user. */
                public user?: (chat.realtime.v1.IUser|null);

                /** TypingUpdatedPayload isTyping. */
                public isTyping: boolean;

                /**
                 * Creates a new TypingUpdatedPayload instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns TypingUpdatedPayload instance
                 */
                public static create(properties?: chat.realtime.v1.ITypingUpdatedPayload): chat.realtime.v1.TypingUpdatedPayload;

                /**
                 * Encodes the specified TypingUpdatedPayload message. Does not implicitly {@link chat.realtime.v1.TypingUpdatedPayload.verify|verify} messages.
                 * @param message TypingUpdatedPayload message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: chat.realtime.v1.ITypingUpdatedPayload, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified TypingUpdatedPayload message, length delimited. Does not implicitly {@link chat.realtime.v1.TypingUpdatedPayload.verify|verify} messages.
                 * @param message TypingUpdatedPayload message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: chat.realtime.v1.ITypingUpdatedPayload, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a TypingUpdatedPayload message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns TypingUpdatedPayload
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.realtime.v1.TypingUpdatedPayload;

                /**
                 * Decodes a TypingUpdatedPayload message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns TypingUpdatedPayload
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.realtime.v1.TypingUpdatedPayload;

                /**
                 * Verifies a TypingUpdatedPayload message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a TypingUpdatedPayload message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns TypingUpdatedPayload
                 */
                public static fromObject(object: { [k: string]: any }): chat.realtime.v1.TypingUpdatedPayload;

                /**
                 * Creates a plain object from a TypingUpdatedPayload message. Also converts values to other types if specified.
                 * @param message TypingUpdatedPayload
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: chat.realtime.v1.TypingUpdatedPayload, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this TypingUpdatedPayload to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for TypingUpdatedPayload
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a RealtimeEvent. */
            interface IRealtimeEvent {

                /** RealtimeEvent eventId */
                eventId?: (string|null);

                /** RealtimeEvent type */
                type?: (chat.realtime.v1.RealtimeEventType|null);

                /** RealtimeEvent emittedAt */
                emittedAt?: (string|null);

                /** RealtimeEvent messageCreated */
                messageCreated?: (chat.realtime.v1.IMessageCreatedPayload|null);

                /** RealtimeEvent conversationCreated */
                conversationCreated?: (chat.realtime.v1.IConversationCreatedPayload|null);

                /** RealtimeEvent conversationUpdated */
                conversationUpdated?: (chat.realtime.v1.IConversationUpdatedPayload|null);

                /** RealtimeEvent typingUpdated */
                typingUpdated?: (chat.realtime.v1.ITypingUpdatedPayload|null);
            }

            /** Represents a RealtimeEvent. */
            class RealtimeEvent implements IRealtimeEvent {

                /**
                 * Constructs a new RealtimeEvent.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: chat.realtime.v1.IRealtimeEvent);

                /** RealtimeEvent eventId. */
                public eventId: string;

                /** RealtimeEvent type. */
                public type: chat.realtime.v1.RealtimeEventType;

                /** RealtimeEvent emittedAt. */
                public emittedAt: string;

                /** RealtimeEvent messageCreated. */
                public messageCreated?: (chat.realtime.v1.IMessageCreatedPayload|null);

                /** RealtimeEvent conversationCreated. */
                public conversationCreated?: (chat.realtime.v1.IConversationCreatedPayload|null);

                /** RealtimeEvent conversationUpdated. */
                public conversationUpdated?: (chat.realtime.v1.IConversationUpdatedPayload|null);

                /** RealtimeEvent typingUpdated. */
                public typingUpdated?: (chat.realtime.v1.ITypingUpdatedPayload|null);

                /** RealtimeEvent payload. */
                public payload?: ("messageCreated"|"conversationCreated"|"conversationUpdated"|"typingUpdated");

                /**
                 * Creates a new RealtimeEvent instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns RealtimeEvent instance
                 */
                public static create(properties?: chat.realtime.v1.IRealtimeEvent): chat.realtime.v1.RealtimeEvent;

                /**
                 * Encodes the specified RealtimeEvent message. Does not implicitly {@link chat.realtime.v1.RealtimeEvent.verify|verify} messages.
                 * @param message RealtimeEvent message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: chat.realtime.v1.IRealtimeEvent, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified RealtimeEvent message, length delimited. Does not implicitly {@link chat.realtime.v1.RealtimeEvent.verify|verify} messages.
                 * @param message RealtimeEvent message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: chat.realtime.v1.IRealtimeEvent, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a RealtimeEvent message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns RealtimeEvent
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.realtime.v1.RealtimeEvent;

                /**
                 * Decodes a RealtimeEvent message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns RealtimeEvent
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.realtime.v1.RealtimeEvent;

                /**
                 * Verifies a RealtimeEvent message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a RealtimeEvent message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns RealtimeEvent
                 */
                public static fromObject(object: { [k: string]: any }): chat.realtime.v1.RealtimeEvent;

                /**
                 * Creates a plain object from a RealtimeEvent message. Also converts values to other types if specified.
                 * @param message RealtimeEvent
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: chat.realtime.v1.RealtimeEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this RealtimeEvent to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for RealtimeEvent
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }
    }
}

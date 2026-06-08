/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import $protobuf from "protobufjs/minimal.js";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const chat = $root.chat = (() => {

    /**
     * Namespace chat.
     * @exports chat
     * @namespace
     */
    const chat = {};

    chat.realtime = (function() {

        /**
         * Namespace realtime.
         * @memberof chat
         * @namespace
         */
        const realtime = {};

        realtime.v1 = (function() {

            /**
             * Namespace v1.
             * @memberof chat.realtime
             * @namespace
             */
            const v1 = {};

            /**
             * RealtimeEventType enum.
             * @name chat.realtime.v1.RealtimeEventType
             * @enum {number}
             * @property {number} REALTIME_EVENT_TYPE_UNSPECIFIED=0 REALTIME_EVENT_TYPE_UNSPECIFIED value
             * @property {number} MESSAGE_CREATED=1 MESSAGE_CREATED value
             * @property {number} CONVERSATION_CREATED=2 CONVERSATION_CREATED value
             * @property {number} CONVERSATION_UPDATED=3 CONVERSATION_UPDATED value
             * @property {number} TYPING_UPDATED=4 TYPING_UPDATED value
             */
            v1.RealtimeEventType = (function() {
                const valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "REALTIME_EVENT_TYPE_UNSPECIFIED"] = 0;
                values[valuesById[1] = "MESSAGE_CREATED"] = 1;
                values[valuesById[2] = "CONVERSATION_CREATED"] = 2;
                values[valuesById[3] = "CONVERSATION_UPDATED"] = 3;
                values[valuesById[4] = "TYPING_UPDATED"] = 4;
                return values;
            })();

            /**
             * ConversationType enum.
             * @name chat.realtime.v1.ConversationType
             * @enum {number}
             * @property {number} CONVERSATION_TYPE_UNSPECIFIED=0 CONVERSATION_TYPE_UNSPECIFIED value
             * @property {number} GROUP=1 GROUP value
             * @property {number} DIRECT=2 DIRECT value
             */
            v1.ConversationType = (function() {
                const valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "CONVERSATION_TYPE_UNSPECIFIED"] = 0;
                values[valuesById[1] = "GROUP"] = 1;
                values[valuesById[2] = "DIRECT"] = 2;
                return values;
            })();

            /**
             * MessageType enum.
             * @name chat.realtime.v1.MessageType
             * @enum {number}
             * @property {number} MESSAGE_TYPE_UNSPECIFIED=0 MESSAGE_TYPE_UNSPECIFIED value
             * @property {number} TEXT=1 TEXT value
             */
            v1.MessageType = (function() {
                const valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "MESSAGE_TYPE_UNSPECIFIED"] = 0;
                values[valuesById[1] = "TEXT"] = 1;
                return values;
            })();

            v1.User = (function() {

                /**
                 * Properties of a User.
                 * @memberof chat.realtime.v1
                 * @interface IUser
                 * @property {string|null} [id] User id
                 * @property {string|null} [username] User username
                 * @property {string|null} [name] User name
                 * @property {string|null} [avatarUrl] User avatarUrl
                 * @property {string|null} [title] User title
                 */

                /**
                 * Constructs a new User.
                 * @memberof chat.realtime.v1
                 * @classdesc Represents a User.
                 * @implements IUser
                 * @constructor
                 * @param {chat.realtime.v1.IUser=} [properties] Properties to set
                 */
                function User(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * User id.
                 * @member {string} id
                 * @memberof chat.realtime.v1.User
                 * @instance
                 */
                User.prototype.id = "";

                /**
                 * User username.
                 * @member {string} username
                 * @memberof chat.realtime.v1.User
                 * @instance
                 */
                User.prototype.username = "";

                /**
                 * User name.
                 * @member {string} name
                 * @memberof chat.realtime.v1.User
                 * @instance
                 */
                User.prototype.name = "";

                /**
                 * User avatarUrl.
                 * @member {string|null|undefined} avatarUrl
                 * @memberof chat.realtime.v1.User
                 * @instance
                 */
                User.prototype.avatarUrl = null;

                /**
                 * User title.
                 * @member {string|null|undefined} title
                 * @memberof chat.realtime.v1.User
                 * @instance
                 */
                User.prototype.title = null;

                // OneOf field names bound to virtual getters and setters
                let $oneOfFields;

                // Virtual OneOf for proto3 optional field
                Object.defineProperty(User.prototype, "_avatarUrl", {
                    get: $util.oneOfGetter($oneOfFields = ["avatarUrl"]),
                    set: $util.oneOfSetter($oneOfFields)
                });

                // Virtual OneOf for proto3 optional field
                Object.defineProperty(User.prototype, "_title", {
                    get: $util.oneOfGetter($oneOfFields = ["title"]),
                    set: $util.oneOfSetter($oneOfFields)
                });

                /**
                 * Creates a new User instance using the specified properties.
                 * @function create
                 * @memberof chat.realtime.v1.User
                 * @static
                 * @param {chat.realtime.v1.IUser=} [properties] Properties to set
                 * @returns {chat.realtime.v1.User} User instance
                 */
                User.create = function create(properties) {
                    return new User(properties);
                };

                /**
                 * Encodes the specified User message. Does not implicitly {@link chat.realtime.v1.User.verify|verify} messages.
                 * @function encode
                 * @memberof chat.realtime.v1.User
                 * @static
                 * @param {chat.realtime.v1.IUser} message User message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                User.encode = function encode(message, writer, q) {
                    if (!writer)
                        writer = $Writer.create();
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                    if (message.username != null && Object.hasOwnProperty.call(message, "username"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.username);
                    if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.name);
                    if (message.avatarUrl != null && Object.hasOwnProperty.call(message, "avatarUrl"))
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.avatarUrl);
                    if (message.title != null && Object.hasOwnProperty.call(message, "title"))
                        writer.uint32(/* id 5, wireType 2 =*/42).string(message.title);
                    return writer;
                };

                /**
                 * Encodes the specified User message, length delimited. Does not implicitly {@link chat.realtime.v1.User.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof chat.realtime.v1.User
                 * @static
                 * @param {chat.realtime.v1.IUser} message User message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                User.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                };

                /**
                 * Decodes a User message from the specified reader or buffer.
                 * @function decode
                 * @memberof chat.realtime.v1.User
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {chat.realtime.v1.User} User
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                User.decode = function decode(reader, length, error, long) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    if (long === undefined)
                        long = 0;
                    if (long > $Reader.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.realtime.v1.User();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.id = reader.string();
                                break;
                            }
                        case 2: {
                                message.username = reader.string();
                                break;
                            }
                        case 3: {
                                message.name = reader.string();
                                break;
                            }
                        case 4: {
                                message.avatarUrl = reader.string();
                                break;
                            }
                        case 5: {
                                message.title = reader.string();
                                break;
                            }
                        default:
                            reader.skipType(tag & 7, long);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a User message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof chat.realtime.v1.User
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {chat.realtime.v1.User} User
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                User.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a User message.
                 * @function verify
                 * @memberof chat.realtime.v1.User
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                User.verify = function verify(message, long) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        return "maximum nesting depth exceeded";
                    let properties = {};
                    if (message.id != null && message.hasOwnProperty("id"))
                        if (!$util.isString(message.id))
                            return "id: string expected";
                    if (message.username != null && message.hasOwnProperty("username"))
                        if (!$util.isString(message.username))
                            return "username: string expected";
                    if (message.name != null && message.hasOwnProperty("name"))
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    if (message.avatarUrl != null && message.hasOwnProperty("avatarUrl")) {
                        properties._avatarUrl = 1;
                        if (!$util.isString(message.avatarUrl))
                            return "avatarUrl: string expected";
                    }
                    if (message.title != null && message.hasOwnProperty("title")) {
                        properties._title = 1;
                        if (!$util.isString(message.title))
                            return "title: string expected";
                    }
                    return null;
                };

                /**
                 * Creates a User message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof chat.realtime.v1.User
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {chat.realtime.v1.User} User
                 */
                User.fromObject = function fromObject(object, long) {
                    if (object instanceof $root.chat.realtime.v1.User)
                        return object;
                    if (!$util.isObject(object))
                        throw TypeError(".chat.realtime.v1.User: object expected");
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    let message = new $root.chat.realtime.v1.User();
                    if (object.id != null)
                        message.id = String(object.id);
                    if (object.username != null)
                        message.username = String(object.username);
                    if (object.name != null)
                        message.name = String(object.name);
                    if (object.avatarUrl != null)
                        message.avatarUrl = String(object.avatarUrl);
                    if (object.title != null)
                        message.title = String(object.title);
                    return message;
                };

                /**
                 * Creates a plain object from a User message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof chat.realtime.v1.User
                 * @static
                 * @param {chat.realtime.v1.User} message User
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                User.toObject = function toObject(message, options, q) {
                    if (!options)
                        options = {};
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    let object = {};
                    if (options.defaults) {
                        object.id = "";
                        object.username = "";
                        object.name = "";
                    }
                    if (message.id != null && message.hasOwnProperty("id"))
                        object.id = message.id;
                    if (message.username != null && message.hasOwnProperty("username"))
                        object.username = message.username;
                    if (message.name != null && message.hasOwnProperty("name"))
                        object.name = message.name;
                    if (message.avatarUrl != null && message.hasOwnProperty("avatarUrl")) {
                        object.avatarUrl = message.avatarUrl;
                        if (options.oneofs)
                            object._avatarUrl = "avatarUrl";
                    }
                    if (message.title != null && message.hasOwnProperty("title")) {
                        object.title = message.title;
                        if (options.oneofs)
                            object._title = "title";
                    }
                    return object;
                };

                /**
                 * Converts this User to JSON.
                 * @function toJSON
                 * @memberof chat.realtime.v1.User
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                User.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for User
                 * @function getTypeUrl
                 * @memberof chat.realtime.v1.User
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                User.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/chat.realtime.v1.User";
                };

                return User;
            })();

            v1.MessagePreview = (function() {

                /**
                 * Properties of a MessagePreview.
                 * @memberof chat.realtime.v1
                 * @interface IMessagePreview
                 * @property {string|null} [id] MessagePreview id
                 * @property {string|null} [conversationId] MessagePreview conversationId
                 * @property {chat.realtime.v1.IUser|null} [sender] MessagePreview sender
                 * @property {string|null} [body] MessagePreview body
                 * @property {chat.realtime.v1.MessageType|null} [type] MessagePreview type
                 * @property {string|null} [createdAt] MessagePreview createdAt
                 */

                /**
                 * Constructs a new MessagePreview.
                 * @memberof chat.realtime.v1
                 * @classdesc Represents a MessagePreview.
                 * @implements IMessagePreview
                 * @constructor
                 * @param {chat.realtime.v1.IMessagePreview=} [properties] Properties to set
                 */
                function MessagePreview(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * MessagePreview id.
                 * @member {string} id
                 * @memberof chat.realtime.v1.MessagePreview
                 * @instance
                 */
                MessagePreview.prototype.id = "";

                /**
                 * MessagePreview conversationId.
                 * @member {string} conversationId
                 * @memberof chat.realtime.v1.MessagePreview
                 * @instance
                 */
                MessagePreview.prototype.conversationId = "";

                /**
                 * MessagePreview sender.
                 * @member {chat.realtime.v1.IUser|null|undefined} sender
                 * @memberof chat.realtime.v1.MessagePreview
                 * @instance
                 */
                MessagePreview.prototype.sender = null;

                /**
                 * MessagePreview body.
                 * @member {string} body
                 * @memberof chat.realtime.v1.MessagePreview
                 * @instance
                 */
                MessagePreview.prototype.body = "";

                /**
                 * MessagePreview type.
                 * @member {chat.realtime.v1.MessageType} type
                 * @memberof chat.realtime.v1.MessagePreview
                 * @instance
                 */
                MessagePreview.prototype.type = 0;

                /**
                 * MessagePreview createdAt.
                 * @member {string} createdAt
                 * @memberof chat.realtime.v1.MessagePreview
                 * @instance
                 */
                MessagePreview.prototype.createdAt = "";

                /**
                 * Creates a new MessagePreview instance using the specified properties.
                 * @function create
                 * @memberof chat.realtime.v1.MessagePreview
                 * @static
                 * @param {chat.realtime.v1.IMessagePreview=} [properties] Properties to set
                 * @returns {chat.realtime.v1.MessagePreview} MessagePreview instance
                 */
                MessagePreview.create = function create(properties) {
                    return new MessagePreview(properties);
                };

                /**
                 * Encodes the specified MessagePreview message. Does not implicitly {@link chat.realtime.v1.MessagePreview.verify|verify} messages.
                 * @function encode
                 * @memberof chat.realtime.v1.MessagePreview
                 * @static
                 * @param {chat.realtime.v1.IMessagePreview} message MessagePreview message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                MessagePreview.encode = function encode(message, writer, q) {
                    if (!writer)
                        writer = $Writer.create();
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                    if (message.conversationId != null && Object.hasOwnProperty.call(message, "conversationId"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.conversationId);
                    if (message.sender != null && Object.hasOwnProperty.call(message, "sender"))
                        $root.chat.realtime.v1.User.encode(message.sender, writer.uint32(/* id 3, wireType 2 =*/26).fork(), q + 1).ldelim();
                    if (message.body != null && Object.hasOwnProperty.call(message, "body"))
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.body);
                    if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                        writer.uint32(/* id 5, wireType 0 =*/40).int32(message.type);
                    if (message.createdAt != null && Object.hasOwnProperty.call(message, "createdAt"))
                        writer.uint32(/* id 6, wireType 2 =*/50).string(message.createdAt);
                    return writer;
                };

                /**
                 * Encodes the specified MessagePreview message, length delimited. Does not implicitly {@link chat.realtime.v1.MessagePreview.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof chat.realtime.v1.MessagePreview
                 * @static
                 * @param {chat.realtime.v1.IMessagePreview} message MessagePreview message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                MessagePreview.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                };

                /**
                 * Decodes a MessagePreview message from the specified reader or buffer.
                 * @function decode
                 * @memberof chat.realtime.v1.MessagePreview
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {chat.realtime.v1.MessagePreview} MessagePreview
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                MessagePreview.decode = function decode(reader, length, error, long) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    if (long === undefined)
                        long = 0;
                    if (long > $Reader.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.realtime.v1.MessagePreview();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.id = reader.string();
                                break;
                            }
                        case 2: {
                                message.conversationId = reader.string();
                                break;
                            }
                        case 3: {
                                message.sender = $root.chat.realtime.v1.User.decode(reader, reader.uint32(), undefined, long + 1);
                                break;
                            }
                        case 4: {
                                message.body = reader.string();
                                break;
                            }
                        case 5: {
                                message.type = reader.int32();
                                break;
                            }
                        case 6: {
                                message.createdAt = reader.string();
                                break;
                            }
                        default:
                            reader.skipType(tag & 7, long);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a MessagePreview message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof chat.realtime.v1.MessagePreview
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {chat.realtime.v1.MessagePreview} MessagePreview
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                MessagePreview.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a MessagePreview message.
                 * @function verify
                 * @memberof chat.realtime.v1.MessagePreview
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                MessagePreview.verify = function verify(message, long) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        return "maximum nesting depth exceeded";
                    if (message.id != null && message.hasOwnProperty("id"))
                        if (!$util.isString(message.id))
                            return "id: string expected";
                    if (message.conversationId != null && message.hasOwnProperty("conversationId"))
                        if (!$util.isString(message.conversationId))
                            return "conversationId: string expected";
                    if (message.sender != null && message.hasOwnProperty("sender")) {
                        let error = $root.chat.realtime.v1.User.verify(message.sender, long + 1);
                        if (error)
                            return "sender." + error;
                    }
                    if (message.body != null && message.hasOwnProperty("body"))
                        if (!$util.isString(message.body))
                            return "body: string expected";
                    if (message.type != null && message.hasOwnProperty("type"))
                        switch (message.type) {
                        default:
                            return "type: enum value expected";
                        case 0:
                        case 1:
                            break;
                        }
                    if (message.createdAt != null && message.hasOwnProperty("createdAt"))
                        if (!$util.isString(message.createdAt))
                            return "createdAt: string expected";
                    return null;
                };

                /**
                 * Creates a MessagePreview message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof chat.realtime.v1.MessagePreview
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {chat.realtime.v1.MessagePreview} MessagePreview
                 */
                MessagePreview.fromObject = function fromObject(object, long) {
                    if (object instanceof $root.chat.realtime.v1.MessagePreview)
                        return object;
                    if (!$util.isObject(object))
                        throw TypeError(".chat.realtime.v1.MessagePreview: object expected");
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    let message = new $root.chat.realtime.v1.MessagePreview();
                    if (object.id != null)
                        message.id = String(object.id);
                    if (object.conversationId != null)
                        message.conversationId = String(object.conversationId);
                    if (object.sender != null) {
                        if (!$util.isObject(object.sender))
                            throw TypeError(".chat.realtime.v1.MessagePreview.sender: object expected");
                        message.sender = $root.chat.realtime.v1.User.fromObject(object.sender, long + 1);
                    }
                    if (object.body != null)
                        message.body = String(object.body);
                    switch (object.type) {
                    default:
                        if (typeof object.type === "number") {
                            message.type = object.type;
                            break;
                        }
                        break;
                    case "MESSAGE_TYPE_UNSPECIFIED":
                    case 0:
                        message.type = 0;
                        break;
                    case "TEXT":
                    case 1:
                        message.type = 1;
                        break;
                    }
                    if (object.createdAt != null)
                        message.createdAt = String(object.createdAt);
                    return message;
                };

                /**
                 * Creates a plain object from a MessagePreview message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof chat.realtime.v1.MessagePreview
                 * @static
                 * @param {chat.realtime.v1.MessagePreview} message MessagePreview
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                MessagePreview.toObject = function toObject(message, options, q) {
                    if (!options)
                        options = {};
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    let object = {};
                    if (options.defaults) {
                        object.id = "";
                        object.conversationId = "";
                        object.sender = null;
                        object.body = "";
                        object.type = options.enums === String ? "MESSAGE_TYPE_UNSPECIFIED" : 0;
                        object.createdAt = "";
                    }
                    if (message.id != null && message.hasOwnProperty("id"))
                        object.id = message.id;
                    if (message.conversationId != null && message.hasOwnProperty("conversationId"))
                        object.conversationId = message.conversationId;
                    if (message.sender != null && message.hasOwnProperty("sender"))
                        object.sender = $root.chat.realtime.v1.User.toObject(message.sender, options, q + 1);
                    if (message.body != null && message.hasOwnProperty("body"))
                        object.body = message.body;
                    if (message.type != null && message.hasOwnProperty("type"))
                        object.type = options.enums === String ? $root.chat.realtime.v1.MessageType[message.type] === undefined ? message.type : $root.chat.realtime.v1.MessageType[message.type] : message.type;
                    if (message.createdAt != null && message.hasOwnProperty("createdAt"))
                        object.createdAt = message.createdAt;
                    return object;
                };

                /**
                 * Converts this MessagePreview to JSON.
                 * @function toJSON
                 * @memberof chat.realtime.v1.MessagePreview
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                MessagePreview.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for MessagePreview
                 * @function getTypeUrl
                 * @memberof chat.realtime.v1.MessagePreview
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                MessagePreview.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/chat.realtime.v1.MessagePreview";
                };

                return MessagePreview;
            })();

            v1.MessageQuote = (function() {

                /**
                 * Properties of a MessageQuote.
                 * @memberof chat.realtime.v1
                 * @interface IMessageQuote
                 * @property {string|null} [id] MessageQuote id
                 * @property {chat.realtime.v1.IUser|null} [sender] MessageQuote sender
                 * @property {string|null} [body] MessageQuote body
                 * @property {chat.realtime.v1.MessageType|null} [type] MessageQuote type
                 * @property {string|null} [createdAt] MessageQuote createdAt
                 */

                /**
                 * Constructs a new MessageQuote.
                 * @memberof chat.realtime.v1
                 * @classdesc Represents a MessageQuote.
                 * @implements IMessageQuote
                 * @constructor
                 * @param {chat.realtime.v1.IMessageQuote=} [properties] Properties to set
                 */
                function MessageQuote(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * MessageQuote id.
                 * @member {string} id
                 * @memberof chat.realtime.v1.MessageQuote
                 * @instance
                 */
                MessageQuote.prototype.id = "";

                /**
                 * MessageQuote sender.
                 * @member {chat.realtime.v1.IUser|null|undefined} sender
                 * @memberof chat.realtime.v1.MessageQuote
                 * @instance
                 */
                MessageQuote.prototype.sender = null;

                /**
                 * MessageQuote body.
                 * @member {string} body
                 * @memberof chat.realtime.v1.MessageQuote
                 * @instance
                 */
                MessageQuote.prototype.body = "";

                /**
                 * MessageQuote type.
                 * @member {chat.realtime.v1.MessageType} type
                 * @memberof chat.realtime.v1.MessageQuote
                 * @instance
                 */
                MessageQuote.prototype.type = 0;

                /**
                 * MessageQuote createdAt.
                 * @member {string} createdAt
                 * @memberof chat.realtime.v1.MessageQuote
                 * @instance
                 */
                MessageQuote.prototype.createdAt = "";

                /**
                 * Creates a new MessageQuote instance using the specified properties.
                 * @function create
                 * @memberof chat.realtime.v1.MessageQuote
                 * @static
                 * @param {chat.realtime.v1.IMessageQuote=} [properties] Properties to set
                 * @returns {chat.realtime.v1.MessageQuote} MessageQuote instance
                 */
                MessageQuote.create = function create(properties) {
                    return new MessageQuote(properties);
                };

                /**
                 * Encodes the specified MessageQuote message. Does not implicitly {@link chat.realtime.v1.MessageQuote.verify|verify} messages.
                 * @function encode
                 * @memberof chat.realtime.v1.MessageQuote
                 * @static
                 * @param {chat.realtime.v1.IMessageQuote} message MessageQuote message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                MessageQuote.encode = function encode(message, writer, q) {
                    if (!writer)
                        writer = $Writer.create();
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                    if (message.sender != null && Object.hasOwnProperty.call(message, "sender"))
                        $root.chat.realtime.v1.User.encode(message.sender, writer.uint32(/* id 2, wireType 2 =*/18).fork(), q + 1).ldelim();
                    if (message.body != null && Object.hasOwnProperty.call(message, "body"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.body);
                    if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                        writer.uint32(/* id 4, wireType 0 =*/32).int32(message.type);
                    if (message.createdAt != null && Object.hasOwnProperty.call(message, "createdAt"))
                        writer.uint32(/* id 5, wireType 2 =*/42).string(message.createdAt);
                    return writer;
                };

                /**
                 * Encodes the specified MessageQuote message, length delimited. Does not implicitly {@link chat.realtime.v1.MessageQuote.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof chat.realtime.v1.MessageQuote
                 * @static
                 * @param {chat.realtime.v1.IMessageQuote} message MessageQuote message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                MessageQuote.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                };

                /**
                 * Decodes a MessageQuote message from the specified reader or buffer.
                 * @function decode
                 * @memberof chat.realtime.v1.MessageQuote
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {chat.realtime.v1.MessageQuote} MessageQuote
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                MessageQuote.decode = function decode(reader, length, error, long) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    if (long === undefined)
                        long = 0;
                    if (long > $Reader.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.realtime.v1.MessageQuote();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.id = reader.string();
                                break;
                            }
                        case 2: {
                                message.sender = $root.chat.realtime.v1.User.decode(reader, reader.uint32(), undefined, long + 1);
                                break;
                            }
                        case 3: {
                                message.body = reader.string();
                                break;
                            }
                        case 4: {
                                message.type = reader.int32();
                                break;
                            }
                        case 5: {
                                message.createdAt = reader.string();
                                break;
                            }
                        default:
                            reader.skipType(tag & 7, long);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a MessageQuote message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof chat.realtime.v1.MessageQuote
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {chat.realtime.v1.MessageQuote} MessageQuote
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                MessageQuote.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a MessageQuote message.
                 * @function verify
                 * @memberof chat.realtime.v1.MessageQuote
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                MessageQuote.verify = function verify(message, long) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        return "maximum nesting depth exceeded";
                    if (message.id != null && message.hasOwnProperty("id"))
                        if (!$util.isString(message.id))
                            return "id: string expected";
                    if (message.sender != null && message.hasOwnProperty("sender")) {
                        let error = $root.chat.realtime.v1.User.verify(message.sender, long + 1);
                        if (error)
                            return "sender." + error;
                    }
                    if (message.body != null && message.hasOwnProperty("body"))
                        if (!$util.isString(message.body))
                            return "body: string expected";
                    if (message.type != null && message.hasOwnProperty("type"))
                        switch (message.type) {
                        default:
                            return "type: enum value expected";
                        case 0:
                        case 1:
                            break;
                        }
                    if (message.createdAt != null && message.hasOwnProperty("createdAt"))
                        if (!$util.isString(message.createdAt))
                            return "createdAt: string expected";
                    return null;
                };

                /**
                 * Creates a MessageQuote message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof chat.realtime.v1.MessageQuote
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {chat.realtime.v1.MessageQuote} MessageQuote
                 */
                MessageQuote.fromObject = function fromObject(object, long) {
                    if (object instanceof $root.chat.realtime.v1.MessageQuote)
                        return object;
                    if (!$util.isObject(object))
                        throw TypeError(".chat.realtime.v1.MessageQuote: object expected");
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    let message = new $root.chat.realtime.v1.MessageQuote();
                    if (object.id != null)
                        message.id = String(object.id);
                    if (object.sender != null) {
                        if (!$util.isObject(object.sender))
                            throw TypeError(".chat.realtime.v1.MessageQuote.sender: object expected");
                        message.sender = $root.chat.realtime.v1.User.fromObject(object.sender, long + 1);
                    }
                    if (object.body != null)
                        message.body = String(object.body);
                    switch (object.type) {
                    default:
                        if (typeof object.type === "number") {
                            message.type = object.type;
                            break;
                        }
                        break;
                    case "MESSAGE_TYPE_UNSPECIFIED":
                    case 0:
                        message.type = 0;
                        break;
                    case "TEXT":
                    case 1:
                        message.type = 1;
                        break;
                    }
                    if (object.createdAt != null)
                        message.createdAt = String(object.createdAt);
                    return message;
                };

                /**
                 * Creates a plain object from a MessageQuote message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof chat.realtime.v1.MessageQuote
                 * @static
                 * @param {chat.realtime.v1.MessageQuote} message MessageQuote
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                MessageQuote.toObject = function toObject(message, options, q) {
                    if (!options)
                        options = {};
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    let object = {};
                    if (options.defaults) {
                        object.id = "";
                        object.sender = null;
                        object.body = "";
                        object.type = options.enums === String ? "MESSAGE_TYPE_UNSPECIFIED" : 0;
                        object.createdAt = "";
                    }
                    if (message.id != null && message.hasOwnProperty("id"))
                        object.id = message.id;
                    if (message.sender != null && message.hasOwnProperty("sender"))
                        object.sender = $root.chat.realtime.v1.User.toObject(message.sender, options, q + 1);
                    if (message.body != null && message.hasOwnProperty("body"))
                        object.body = message.body;
                    if (message.type != null && message.hasOwnProperty("type"))
                        object.type = options.enums === String ? $root.chat.realtime.v1.MessageType[message.type] === undefined ? message.type : $root.chat.realtime.v1.MessageType[message.type] : message.type;
                    if (message.createdAt != null && message.hasOwnProperty("createdAt"))
                        object.createdAt = message.createdAt;
                    return object;
                };

                /**
                 * Converts this MessageQuote to JSON.
                 * @function toJSON
                 * @memberof chat.realtime.v1.MessageQuote
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                MessageQuote.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for MessageQuote
                 * @function getTypeUrl
                 * @memberof chat.realtime.v1.MessageQuote
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                MessageQuote.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/chat.realtime.v1.MessageQuote";
                };

                return MessageQuote;
            })();

            v1.Message = (function() {

                /**
                 * Properties of a Message.
                 * @memberof chat.realtime.v1
                 * @interface IMessage
                 * @property {string|null} [id] Message id
                 * @property {string|null} [conversationId] Message conversationId
                 * @property {chat.realtime.v1.IUser|null} [sender] Message sender
                 * @property {chat.realtime.v1.MessageType|null} [type] Message type
                 * @property {string|null} [body] Message body
                 * @property {chat.realtime.v1.IMessageQuote|null} [quoteMessage] Message quoteMessage
                 * @property {Array.<chat.realtime.v1.IUser>|null} [mentions] Message mentions
                 * @property {string|null} [createdAt] Message createdAt
                 * @property {string|null} [updatedAt] Message updatedAt
                 */

                /**
                 * Constructs a new Message.
                 * @memberof chat.realtime.v1
                 * @classdesc Represents a Message.
                 * @implements IMessage
                 * @constructor
                 * @param {chat.realtime.v1.IMessage=} [properties] Properties to set
                 */
                function Message(properties) {
                    this.mentions = [];
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Message id.
                 * @member {string} id
                 * @memberof chat.realtime.v1.Message
                 * @instance
                 */
                Message.prototype.id = "";

                /**
                 * Message conversationId.
                 * @member {string} conversationId
                 * @memberof chat.realtime.v1.Message
                 * @instance
                 */
                Message.prototype.conversationId = "";

                /**
                 * Message sender.
                 * @member {chat.realtime.v1.IUser|null|undefined} sender
                 * @memberof chat.realtime.v1.Message
                 * @instance
                 */
                Message.prototype.sender = null;

                /**
                 * Message type.
                 * @member {chat.realtime.v1.MessageType} type
                 * @memberof chat.realtime.v1.Message
                 * @instance
                 */
                Message.prototype.type = 0;

                /**
                 * Message body.
                 * @member {string} body
                 * @memberof chat.realtime.v1.Message
                 * @instance
                 */
                Message.prototype.body = "";

                /**
                 * Message quoteMessage.
                 * @member {chat.realtime.v1.IMessageQuote|null|undefined} quoteMessage
                 * @memberof chat.realtime.v1.Message
                 * @instance
                 */
                Message.prototype.quoteMessage = null;

                /**
                 * Message mentions.
                 * @member {Array.<chat.realtime.v1.IUser>} mentions
                 * @memberof chat.realtime.v1.Message
                 * @instance
                 */
                Message.prototype.mentions = $util.emptyArray;

                /**
                 * Message createdAt.
                 * @member {string} createdAt
                 * @memberof chat.realtime.v1.Message
                 * @instance
                 */
                Message.prototype.createdAt = "";

                /**
                 * Message updatedAt.
                 * @member {string} updatedAt
                 * @memberof chat.realtime.v1.Message
                 * @instance
                 */
                Message.prototype.updatedAt = "";

                // OneOf field names bound to virtual getters and setters
                let $oneOfFields;

                // Virtual OneOf for proto3 optional field
                Object.defineProperty(Message.prototype, "_quoteMessage", {
                    get: $util.oneOfGetter($oneOfFields = ["quoteMessage"]),
                    set: $util.oneOfSetter($oneOfFields)
                });

                /**
                 * Creates a new Message instance using the specified properties.
                 * @function create
                 * @memberof chat.realtime.v1.Message
                 * @static
                 * @param {chat.realtime.v1.IMessage=} [properties] Properties to set
                 * @returns {chat.realtime.v1.Message} Message instance
                 */
                Message.create = function create(properties) {
                    return new Message(properties);
                };

                /**
                 * Encodes the specified Message message. Does not implicitly {@link chat.realtime.v1.Message.verify|verify} messages.
                 * @function encode
                 * @memberof chat.realtime.v1.Message
                 * @static
                 * @param {chat.realtime.v1.IMessage} message Message message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Message.encode = function encode(message, writer, q) {
                    if (!writer)
                        writer = $Writer.create();
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                    if (message.conversationId != null && Object.hasOwnProperty.call(message, "conversationId"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.conversationId);
                    if (message.sender != null && Object.hasOwnProperty.call(message, "sender"))
                        $root.chat.realtime.v1.User.encode(message.sender, writer.uint32(/* id 3, wireType 2 =*/26).fork(), q + 1).ldelim();
                    if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                        writer.uint32(/* id 4, wireType 0 =*/32).int32(message.type);
                    if (message.body != null && Object.hasOwnProperty.call(message, "body"))
                        writer.uint32(/* id 5, wireType 2 =*/42).string(message.body);
                    if (message.quoteMessage != null && Object.hasOwnProperty.call(message, "quoteMessage"))
                        $root.chat.realtime.v1.MessageQuote.encode(message.quoteMessage, writer.uint32(/* id 6, wireType 2 =*/50).fork(), q + 1).ldelim();
                    if (message.mentions != null && message.mentions.length)
                        for (let i = 0; i < message.mentions.length; ++i)
                            $root.chat.realtime.v1.User.encode(message.mentions[i], writer.uint32(/* id 7, wireType 2 =*/58).fork(), q + 1).ldelim();
                    if (message.createdAt != null && Object.hasOwnProperty.call(message, "createdAt"))
                        writer.uint32(/* id 8, wireType 2 =*/66).string(message.createdAt);
                    if (message.updatedAt != null && Object.hasOwnProperty.call(message, "updatedAt"))
                        writer.uint32(/* id 9, wireType 2 =*/74).string(message.updatedAt);
                    return writer;
                };

                /**
                 * Encodes the specified Message message, length delimited. Does not implicitly {@link chat.realtime.v1.Message.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof chat.realtime.v1.Message
                 * @static
                 * @param {chat.realtime.v1.IMessage} message Message message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Message.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                };

                /**
                 * Decodes a Message message from the specified reader or buffer.
                 * @function decode
                 * @memberof chat.realtime.v1.Message
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {chat.realtime.v1.Message} Message
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Message.decode = function decode(reader, length, error, long) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    if (long === undefined)
                        long = 0;
                    if (long > $Reader.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.realtime.v1.Message();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.id = reader.string();
                                break;
                            }
                        case 2: {
                                message.conversationId = reader.string();
                                break;
                            }
                        case 3: {
                                message.sender = $root.chat.realtime.v1.User.decode(reader, reader.uint32(), undefined, long + 1);
                                break;
                            }
                        case 4: {
                                message.type = reader.int32();
                                break;
                            }
                        case 5: {
                                message.body = reader.string();
                                break;
                            }
                        case 6: {
                                message.quoteMessage = $root.chat.realtime.v1.MessageQuote.decode(reader, reader.uint32(), undefined, long + 1);
                                break;
                            }
                        case 7: {
                                if (!(message.mentions && message.mentions.length))
                                    message.mentions = [];
                                message.mentions.push($root.chat.realtime.v1.User.decode(reader, reader.uint32(), undefined, long + 1));
                                break;
                            }
                        case 8: {
                                message.createdAt = reader.string();
                                break;
                            }
                        case 9: {
                                message.updatedAt = reader.string();
                                break;
                            }
                        default:
                            reader.skipType(tag & 7, long);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Message message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof chat.realtime.v1.Message
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {chat.realtime.v1.Message} Message
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Message.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Message message.
                 * @function verify
                 * @memberof chat.realtime.v1.Message
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Message.verify = function verify(message, long) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        return "maximum nesting depth exceeded";
                    let properties = {};
                    if (message.id != null && message.hasOwnProperty("id"))
                        if (!$util.isString(message.id))
                            return "id: string expected";
                    if (message.conversationId != null && message.hasOwnProperty("conversationId"))
                        if (!$util.isString(message.conversationId))
                            return "conversationId: string expected";
                    if (message.sender != null && message.hasOwnProperty("sender")) {
                        let error = $root.chat.realtime.v1.User.verify(message.sender, long + 1);
                        if (error)
                            return "sender." + error;
                    }
                    if (message.type != null && message.hasOwnProperty("type"))
                        switch (message.type) {
                        default:
                            return "type: enum value expected";
                        case 0:
                        case 1:
                            break;
                        }
                    if (message.body != null && message.hasOwnProperty("body"))
                        if (!$util.isString(message.body))
                            return "body: string expected";
                    if (message.quoteMessage != null && message.hasOwnProperty("quoteMessage")) {
                        properties._quoteMessage = 1;
                        {
                            let error = $root.chat.realtime.v1.MessageQuote.verify(message.quoteMessage, long + 1);
                            if (error)
                                return "quoteMessage." + error;
                        }
                    }
                    if (message.mentions != null && message.hasOwnProperty("mentions")) {
                        if (!Array.isArray(message.mentions))
                            return "mentions: array expected";
                        for (let i = 0; i < message.mentions.length; ++i) {
                            let error = $root.chat.realtime.v1.User.verify(message.mentions[i], long + 1);
                            if (error)
                                return "mentions." + error;
                        }
                    }
                    if (message.createdAt != null && message.hasOwnProperty("createdAt"))
                        if (!$util.isString(message.createdAt))
                            return "createdAt: string expected";
                    if (message.updatedAt != null && message.hasOwnProperty("updatedAt"))
                        if (!$util.isString(message.updatedAt))
                            return "updatedAt: string expected";
                    return null;
                };

                /**
                 * Creates a Message message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof chat.realtime.v1.Message
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {chat.realtime.v1.Message} Message
                 */
                Message.fromObject = function fromObject(object, long) {
                    if (object instanceof $root.chat.realtime.v1.Message)
                        return object;
                    if (!$util.isObject(object))
                        throw TypeError(".chat.realtime.v1.Message: object expected");
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    let message = new $root.chat.realtime.v1.Message();
                    if (object.id != null)
                        message.id = String(object.id);
                    if (object.conversationId != null)
                        message.conversationId = String(object.conversationId);
                    if (object.sender != null) {
                        if (!$util.isObject(object.sender))
                            throw TypeError(".chat.realtime.v1.Message.sender: object expected");
                        message.sender = $root.chat.realtime.v1.User.fromObject(object.sender, long + 1);
                    }
                    switch (object.type) {
                    default:
                        if (typeof object.type === "number") {
                            message.type = object.type;
                            break;
                        }
                        break;
                    case "MESSAGE_TYPE_UNSPECIFIED":
                    case 0:
                        message.type = 0;
                        break;
                    case "TEXT":
                    case 1:
                        message.type = 1;
                        break;
                    }
                    if (object.body != null)
                        message.body = String(object.body);
                    if (object.quoteMessage != null) {
                        if (!$util.isObject(object.quoteMessage))
                            throw TypeError(".chat.realtime.v1.Message.quoteMessage: object expected");
                        message.quoteMessage = $root.chat.realtime.v1.MessageQuote.fromObject(object.quoteMessage, long + 1);
                    }
                    if (object.mentions) {
                        if (!Array.isArray(object.mentions))
                            throw TypeError(".chat.realtime.v1.Message.mentions: array expected");
                        message.mentions = [];
                        for (let i = 0; i < object.mentions.length; ++i) {
                            if (!$util.isObject(object.mentions[i]))
                                throw TypeError(".chat.realtime.v1.Message.mentions: object expected");
                            message.mentions[i] = $root.chat.realtime.v1.User.fromObject(object.mentions[i], long + 1);
                        }
                    }
                    if (object.createdAt != null)
                        message.createdAt = String(object.createdAt);
                    if (object.updatedAt != null)
                        message.updatedAt = String(object.updatedAt);
                    return message;
                };

                /**
                 * Creates a plain object from a Message message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof chat.realtime.v1.Message
                 * @static
                 * @param {chat.realtime.v1.Message} message Message
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Message.toObject = function toObject(message, options, q) {
                    if (!options)
                        options = {};
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    let object = {};
                    if (options.arrays || options.defaults)
                        object.mentions = [];
                    if (options.defaults) {
                        object.id = "";
                        object.conversationId = "";
                        object.sender = null;
                        object.type = options.enums === String ? "MESSAGE_TYPE_UNSPECIFIED" : 0;
                        object.body = "";
                        object.createdAt = "";
                        object.updatedAt = "";
                    }
                    if (message.id != null && message.hasOwnProperty("id"))
                        object.id = message.id;
                    if (message.conversationId != null && message.hasOwnProperty("conversationId"))
                        object.conversationId = message.conversationId;
                    if (message.sender != null && message.hasOwnProperty("sender"))
                        object.sender = $root.chat.realtime.v1.User.toObject(message.sender, options, q + 1);
                    if (message.type != null && message.hasOwnProperty("type"))
                        object.type = options.enums === String ? $root.chat.realtime.v1.MessageType[message.type] === undefined ? message.type : $root.chat.realtime.v1.MessageType[message.type] : message.type;
                    if (message.body != null && message.hasOwnProperty("body"))
                        object.body = message.body;
                    if (message.quoteMessage != null && message.hasOwnProperty("quoteMessage")) {
                        object.quoteMessage = $root.chat.realtime.v1.MessageQuote.toObject(message.quoteMessage, options, q + 1);
                        if (options.oneofs)
                            object._quoteMessage = "quoteMessage";
                    }
                    if (message.mentions && message.mentions.length) {
                        object.mentions = [];
                        for (let j = 0; j < message.mentions.length; ++j)
                            object.mentions[j] = $root.chat.realtime.v1.User.toObject(message.mentions[j], options, q + 1);
                    }
                    if (message.createdAt != null && message.hasOwnProperty("createdAt"))
                        object.createdAt = message.createdAt;
                    if (message.updatedAt != null && message.hasOwnProperty("updatedAt"))
                        object.updatedAt = message.updatedAt;
                    return object;
                };

                /**
                 * Converts this Message to JSON.
                 * @function toJSON
                 * @memberof chat.realtime.v1.Message
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Message.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for Message
                 * @function getTypeUrl
                 * @memberof chat.realtime.v1.Message
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                Message.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/chat.realtime.v1.Message";
                };

                return Message;
            })();

            v1.Conversation = (function() {

                /**
                 * Properties of a Conversation.
                 * @memberof chat.realtime.v1
                 * @interface IConversation
                 * @property {string|null} [id] Conversation id
                 * @property {string|null} [name] Conversation name
                 * @property {chat.realtime.v1.ConversationType|null} [type] Conversation type
                 * @property {Array.<string>|null} [avatarUrls] Conversation avatarUrls
                 * @property {number|null} [memberCount] Conversation memberCount
                 * @property {number|null} [unreadCount] Conversation unreadCount
                 * @property {number|null} [mentionCount] Conversation mentionCount
                 * @property {chat.realtime.v1.IMessagePreview|null} [lastMessage] Conversation lastMessage
                 * @property {string|null} [createdAt] Conversation createdAt
                 * @property {string|null} [updatedAt] Conversation updatedAt
                 */

                /**
                 * Constructs a new Conversation.
                 * @memberof chat.realtime.v1
                 * @classdesc Represents a Conversation.
                 * @implements IConversation
                 * @constructor
                 * @param {chat.realtime.v1.IConversation=} [properties] Properties to set
                 */
                function Conversation(properties) {
                    this.avatarUrls = [];
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Conversation id.
                 * @member {string} id
                 * @memberof chat.realtime.v1.Conversation
                 * @instance
                 */
                Conversation.prototype.id = "";

                /**
                 * Conversation name.
                 * @member {string} name
                 * @memberof chat.realtime.v1.Conversation
                 * @instance
                 */
                Conversation.prototype.name = "";

                /**
                 * Conversation type.
                 * @member {chat.realtime.v1.ConversationType} type
                 * @memberof chat.realtime.v1.Conversation
                 * @instance
                 */
                Conversation.prototype.type = 0;

                /**
                 * Conversation avatarUrls.
                 * @member {Array.<string>} avatarUrls
                 * @memberof chat.realtime.v1.Conversation
                 * @instance
                 */
                Conversation.prototype.avatarUrls = $util.emptyArray;

                /**
                 * Conversation memberCount.
                 * @member {number} memberCount
                 * @memberof chat.realtime.v1.Conversation
                 * @instance
                 */
                Conversation.prototype.memberCount = 0;

                /**
                 * Conversation unreadCount.
                 * @member {number} unreadCount
                 * @memberof chat.realtime.v1.Conversation
                 * @instance
                 */
                Conversation.prototype.unreadCount = 0;

                /**
                 * Conversation mentionCount.
                 * @member {number} mentionCount
                 * @memberof chat.realtime.v1.Conversation
                 * @instance
                 */
                Conversation.prototype.mentionCount = 0;

                /**
                 * Conversation lastMessage.
                 * @member {chat.realtime.v1.IMessagePreview|null|undefined} lastMessage
                 * @memberof chat.realtime.v1.Conversation
                 * @instance
                 */
                Conversation.prototype.lastMessage = null;

                /**
                 * Conversation createdAt.
                 * @member {string} createdAt
                 * @memberof chat.realtime.v1.Conversation
                 * @instance
                 */
                Conversation.prototype.createdAt = "";

                /**
                 * Conversation updatedAt.
                 * @member {string} updatedAt
                 * @memberof chat.realtime.v1.Conversation
                 * @instance
                 */
                Conversation.prototype.updatedAt = "";

                // OneOf field names bound to virtual getters and setters
                let $oneOfFields;

                // Virtual OneOf for proto3 optional field
                Object.defineProperty(Conversation.prototype, "_lastMessage", {
                    get: $util.oneOfGetter($oneOfFields = ["lastMessage"]),
                    set: $util.oneOfSetter($oneOfFields)
                });

                /**
                 * Creates a new Conversation instance using the specified properties.
                 * @function create
                 * @memberof chat.realtime.v1.Conversation
                 * @static
                 * @param {chat.realtime.v1.IConversation=} [properties] Properties to set
                 * @returns {chat.realtime.v1.Conversation} Conversation instance
                 */
                Conversation.create = function create(properties) {
                    return new Conversation(properties);
                };

                /**
                 * Encodes the specified Conversation message. Does not implicitly {@link chat.realtime.v1.Conversation.verify|verify} messages.
                 * @function encode
                 * @memberof chat.realtime.v1.Conversation
                 * @static
                 * @param {chat.realtime.v1.IConversation} message Conversation message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Conversation.encode = function encode(message, writer, q) {
                    if (!writer)
                        writer = $Writer.create();
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                    if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                    if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.type);
                    if (message.avatarUrls != null && message.avatarUrls.length)
                        for (let i = 0; i < message.avatarUrls.length; ++i)
                            writer.uint32(/* id 4, wireType 2 =*/34).string(message.avatarUrls[i]);
                    if (message.memberCount != null && Object.hasOwnProperty.call(message, "memberCount"))
                        writer.uint32(/* id 5, wireType 0 =*/40).int32(message.memberCount);
                    if (message.unreadCount != null && Object.hasOwnProperty.call(message, "unreadCount"))
                        writer.uint32(/* id 6, wireType 0 =*/48).int32(message.unreadCount);
                    if (message.mentionCount != null && Object.hasOwnProperty.call(message, "mentionCount"))
                        writer.uint32(/* id 7, wireType 0 =*/56).int32(message.mentionCount);
                    if (message.lastMessage != null && Object.hasOwnProperty.call(message, "lastMessage"))
                        $root.chat.realtime.v1.MessagePreview.encode(message.lastMessage, writer.uint32(/* id 8, wireType 2 =*/66).fork(), q + 1).ldelim();
                    if (message.createdAt != null && Object.hasOwnProperty.call(message, "createdAt"))
                        writer.uint32(/* id 9, wireType 2 =*/74).string(message.createdAt);
                    if (message.updatedAt != null && Object.hasOwnProperty.call(message, "updatedAt"))
                        writer.uint32(/* id 10, wireType 2 =*/82).string(message.updatedAt);
                    return writer;
                };

                /**
                 * Encodes the specified Conversation message, length delimited. Does not implicitly {@link chat.realtime.v1.Conversation.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof chat.realtime.v1.Conversation
                 * @static
                 * @param {chat.realtime.v1.IConversation} message Conversation message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Conversation.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                };

                /**
                 * Decodes a Conversation message from the specified reader or buffer.
                 * @function decode
                 * @memberof chat.realtime.v1.Conversation
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {chat.realtime.v1.Conversation} Conversation
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Conversation.decode = function decode(reader, length, error, long) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    if (long === undefined)
                        long = 0;
                    if (long > $Reader.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.realtime.v1.Conversation();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.id = reader.string();
                                break;
                            }
                        case 2: {
                                message.name = reader.string();
                                break;
                            }
                        case 3: {
                                message.type = reader.int32();
                                break;
                            }
                        case 4: {
                                if (!(message.avatarUrls && message.avatarUrls.length))
                                    message.avatarUrls = [];
                                message.avatarUrls.push(reader.string());
                                break;
                            }
                        case 5: {
                                message.memberCount = reader.int32();
                                break;
                            }
                        case 6: {
                                message.unreadCount = reader.int32();
                                break;
                            }
                        case 7: {
                                message.mentionCount = reader.int32();
                                break;
                            }
                        case 8: {
                                message.lastMessage = $root.chat.realtime.v1.MessagePreview.decode(reader, reader.uint32(), undefined, long + 1);
                                break;
                            }
                        case 9: {
                                message.createdAt = reader.string();
                                break;
                            }
                        case 10: {
                                message.updatedAt = reader.string();
                                break;
                            }
                        default:
                            reader.skipType(tag & 7, long);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Conversation message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof chat.realtime.v1.Conversation
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {chat.realtime.v1.Conversation} Conversation
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Conversation.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Conversation message.
                 * @function verify
                 * @memberof chat.realtime.v1.Conversation
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Conversation.verify = function verify(message, long) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        return "maximum nesting depth exceeded";
                    let properties = {};
                    if (message.id != null && message.hasOwnProperty("id"))
                        if (!$util.isString(message.id))
                            return "id: string expected";
                    if (message.name != null && message.hasOwnProperty("name"))
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    if (message.type != null && message.hasOwnProperty("type"))
                        switch (message.type) {
                        default:
                            return "type: enum value expected";
                        case 0:
                        case 1:
                        case 2:
                            break;
                        }
                    if (message.avatarUrls != null && message.hasOwnProperty("avatarUrls")) {
                        if (!Array.isArray(message.avatarUrls))
                            return "avatarUrls: array expected";
                        for (let i = 0; i < message.avatarUrls.length; ++i)
                            if (!$util.isString(message.avatarUrls[i]))
                                return "avatarUrls: string[] expected";
                    }
                    if (message.memberCount != null && message.hasOwnProperty("memberCount"))
                        if (!$util.isInteger(message.memberCount))
                            return "memberCount: integer expected";
                    if (message.unreadCount != null && message.hasOwnProperty("unreadCount"))
                        if (!$util.isInteger(message.unreadCount))
                            return "unreadCount: integer expected";
                    if (message.mentionCount != null && message.hasOwnProperty("mentionCount"))
                        if (!$util.isInteger(message.mentionCount))
                            return "mentionCount: integer expected";
                    if (message.lastMessage != null && message.hasOwnProperty("lastMessage")) {
                        properties._lastMessage = 1;
                        {
                            let error = $root.chat.realtime.v1.MessagePreview.verify(message.lastMessage, long + 1);
                            if (error)
                                return "lastMessage." + error;
                        }
                    }
                    if (message.createdAt != null && message.hasOwnProperty("createdAt"))
                        if (!$util.isString(message.createdAt))
                            return "createdAt: string expected";
                    if (message.updatedAt != null && message.hasOwnProperty("updatedAt"))
                        if (!$util.isString(message.updatedAt))
                            return "updatedAt: string expected";
                    return null;
                };

                /**
                 * Creates a Conversation message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof chat.realtime.v1.Conversation
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {chat.realtime.v1.Conversation} Conversation
                 */
                Conversation.fromObject = function fromObject(object, long) {
                    if (object instanceof $root.chat.realtime.v1.Conversation)
                        return object;
                    if (!$util.isObject(object))
                        throw TypeError(".chat.realtime.v1.Conversation: object expected");
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    let message = new $root.chat.realtime.v1.Conversation();
                    if (object.id != null)
                        message.id = String(object.id);
                    if (object.name != null)
                        message.name = String(object.name);
                    switch (object.type) {
                    default:
                        if (typeof object.type === "number") {
                            message.type = object.type;
                            break;
                        }
                        break;
                    case "CONVERSATION_TYPE_UNSPECIFIED":
                    case 0:
                        message.type = 0;
                        break;
                    case "GROUP":
                    case 1:
                        message.type = 1;
                        break;
                    case "DIRECT":
                    case 2:
                        message.type = 2;
                        break;
                    }
                    if (object.avatarUrls) {
                        if (!Array.isArray(object.avatarUrls))
                            throw TypeError(".chat.realtime.v1.Conversation.avatarUrls: array expected");
                        message.avatarUrls = [];
                        for (let i = 0; i < object.avatarUrls.length; ++i)
                            message.avatarUrls[i] = String(object.avatarUrls[i]);
                    }
                    if (object.memberCount != null)
                        message.memberCount = object.memberCount | 0;
                    if (object.unreadCount != null)
                        message.unreadCount = object.unreadCount | 0;
                    if (object.mentionCount != null)
                        message.mentionCount = object.mentionCount | 0;
                    if (object.lastMessage != null) {
                        if (!$util.isObject(object.lastMessage))
                            throw TypeError(".chat.realtime.v1.Conversation.lastMessage: object expected");
                        message.lastMessage = $root.chat.realtime.v1.MessagePreview.fromObject(object.lastMessage, long + 1);
                    }
                    if (object.createdAt != null)
                        message.createdAt = String(object.createdAt);
                    if (object.updatedAt != null)
                        message.updatedAt = String(object.updatedAt);
                    return message;
                };

                /**
                 * Creates a plain object from a Conversation message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof chat.realtime.v1.Conversation
                 * @static
                 * @param {chat.realtime.v1.Conversation} message Conversation
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Conversation.toObject = function toObject(message, options, q) {
                    if (!options)
                        options = {};
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    let object = {};
                    if (options.arrays || options.defaults)
                        object.avatarUrls = [];
                    if (options.defaults) {
                        object.id = "";
                        object.name = "";
                        object.type = options.enums === String ? "CONVERSATION_TYPE_UNSPECIFIED" : 0;
                        object.memberCount = 0;
                        object.unreadCount = 0;
                        object.mentionCount = 0;
                        object.createdAt = "";
                        object.updatedAt = "";
                    }
                    if (message.id != null && message.hasOwnProperty("id"))
                        object.id = message.id;
                    if (message.name != null && message.hasOwnProperty("name"))
                        object.name = message.name;
                    if (message.type != null && message.hasOwnProperty("type"))
                        object.type = options.enums === String ? $root.chat.realtime.v1.ConversationType[message.type] === undefined ? message.type : $root.chat.realtime.v1.ConversationType[message.type] : message.type;
                    if (message.avatarUrls && message.avatarUrls.length) {
                        object.avatarUrls = [];
                        for (let j = 0; j < message.avatarUrls.length; ++j)
                            object.avatarUrls[j] = message.avatarUrls[j];
                    }
                    if (message.memberCount != null && message.hasOwnProperty("memberCount"))
                        object.memberCount = message.memberCount;
                    if (message.unreadCount != null && message.hasOwnProperty("unreadCount"))
                        object.unreadCount = message.unreadCount;
                    if (message.mentionCount != null && message.hasOwnProperty("mentionCount"))
                        object.mentionCount = message.mentionCount;
                    if (message.lastMessage != null && message.hasOwnProperty("lastMessage")) {
                        object.lastMessage = $root.chat.realtime.v1.MessagePreview.toObject(message.lastMessage, options, q + 1);
                        if (options.oneofs)
                            object._lastMessage = "lastMessage";
                    }
                    if (message.createdAt != null && message.hasOwnProperty("createdAt"))
                        object.createdAt = message.createdAt;
                    if (message.updatedAt != null && message.hasOwnProperty("updatedAt"))
                        object.updatedAt = message.updatedAt;
                    return object;
                };

                /**
                 * Converts this Conversation to JSON.
                 * @function toJSON
                 * @memberof chat.realtime.v1.Conversation
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Conversation.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for Conversation
                 * @function getTypeUrl
                 * @memberof chat.realtime.v1.Conversation
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                Conversation.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/chat.realtime.v1.Conversation";
                };

                return Conversation;
            })();

            v1.MessageCreatedPayload = (function() {

                /**
                 * Properties of a MessageCreatedPayload.
                 * @memberof chat.realtime.v1
                 * @interface IMessageCreatedPayload
                 * @property {chat.realtime.v1.IMessage|null} [message] MessageCreatedPayload message
                 */

                /**
                 * Constructs a new MessageCreatedPayload.
                 * @memberof chat.realtime.v1
                 * @classdesc Represents a MessageCreatedPayload.
                 * @implements IMessageCreatedPayload
                 * @constructor
                 * @param {chat.realtime.v1.IMessageCreatedPayload=} [properties] Properties to set
                 */
                function MessageCreatedPayload(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * MessageCreatedPayload message.
                 * @member {chat.realtime.v1.IMessage|null|undefined} message
                 * @memberof chat.realtime.v1.MessageCreatedPayload
                 * @instance
                 */
                MessageCreatedPayload.prototype.message = null;

                /**
                 * Creates a new MessageCreatedPayload instance using the specified properties.
                 * @function create
                 * @memberof chat.realtime.v1.MessageCreatedPayload
                 * @static
                 * @param {chat.realtime.v1.IMessageCreatedPayload=} [properties] Properties to set
                 * @returns {chat.realtime.v1.MessageCreatedPayload} MessageCreatedPayload instance
                 */
                MessageCreatedPayload.create = function create(properties) {
                    return new MessageCreatedPayload(properties);
                };

                /**
                 * Encodes the specified MessageCreatedPayload message. Does not implicitly {@link chat.realtime.v1.MessageCreatedPayload.verify|verify} messages.
                 * @function encode
                 * @memberof chat.realtime.v1.MessageCreatedPayload
                 * @static
                 * @param {chat.realtime.v1.IMessageCreatedPayload} message MessageCreatedPayload message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                MessageCreatedPayload.encode = function encode(message, writer, q) {
                    if (!writer)
                        writer = $Writer.create();
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                        $root.chat.realtime.v1.Message.encode(message.message, writer.uint32(/* id 1, wireType 2 =*/10).fork(), q + 1).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified MessageCreatedPayload message, length delimited. Does not implicitly {@link chat.realtime.v1.MessageCreatedPayload.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof chat.realtime.v1.MessageCreatedPayload
                 * @static
                 * @param {chat.realtime.v1.IMessageCreatedPayload} message MessageCreatedPayload message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                MessageCreatedPayload.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                };

                /**
                 * Decodes a MessageCreatedPayload message from the specified reader or buffer.
                 * @function decode
                 * @memberof chat.realtime.v1.MessageCreatedPayload
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {chat.realtime.v1.MessageCreatedPayload} MessageCreatedPayload
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                MessageCreatedPayload.decode = function decode(reader, length, error, long) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    if (long === undefined)
                        long = 0;
                    if (long > $Reader.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.realtime.v1.MessageCreatedPayload();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.message = $root.chat.realtime.v1.Message.decode(reader, reader.uint32(), undefined, long + 1);
                                break;
                            }
                        default:
                            reader.skipType(tag & 7, long);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a MessageCreatedPayload message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof chat.realtime.v1.MessageCreatedPayload
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {chat.realtime.v1.MessageCreatedPayload} MessageCreatedPayload
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                MessageCreatedPayload.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a MessageCreatedPayload message.
                 * @function verify
                 * @memberof chat.realtime.v1.MessageCreatedPayload
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                MessageCreatedPayload.verify = function verify(message, long) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        return "maximum nesting depth exceeded";
                    if (message.message != null && message.hasOwnProperty("message")) {
                        let error = $root.chat.realtime.v1.Message.verify(message.message, long + 1);
                        if (error)
                            return "message." + error;
                    }
                    return null;
                };

                /**
                 * Creates a MessageCreatedPayload message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof chat.realtime.v1.MessageCreatedPayload
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {chat.realtime.v1.MessageCreatedPayload} MessageCreatedPayload
                 */
                MessageCreatedPayload.fromObject = function fromObject(object, long) {
                    if (object instanceof $root.chat.realtime.v1.MessageCreatedPayload)
                        return object;
                    if (!$util.isObject(object))
                        throw TypeError(".chat.realtime.v1.MessageCreatedPayload: object expected");
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    let message = new $root.chat.realtime.v1.MessageCreatedPayload();
                    if (object.message != null) {
                        if (!$util.isObject(object.message))
                            throw TypeError(".chat.realtime.v1.MessageCreatedPayload.message: object expected");
                        message.message = $root.chat.realtime.v1.Message.fromObject(object.message, long + 1);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a MessageCreatedPayload message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof chat.realtime.v1.MessageCreatedPayload
                 * @static
                 * @param {chat.realtime.v1.MessageCreatedPayload} message MessageCreatedPayload
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                MessageCreatedPayload.toObject = function toObject(message, options, q) {
                    if (!options)
                        options = {};
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    let object = {};
                    if (options.defaults)
                        object.message = null;
                    if (message.message != null && message.hasOwnProperty("message"))
                        object.message = $root.chat.realtime.v1.Message.toObject(message.message, options, q + 1);
                    return object;
                };

                /**
                 * Converts this MessageCreatedPayload to JSON.
                 * @function toJSON
                 * @memberof chat.realtime.v1.MessageCreatedPayload
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                MessageCreatedPayload.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for MessageCreatedPayload
                 * @function getTypeUrl
                 * @memberof chat.realtime.v1.MessageCreatedPayload
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                MessageCreatedPayload.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/chat.realtime.v1.MessageCreatedPayload";
                };

                return MessageCreatedPayload;
            })();

            v1.ConversationCreatedPayload = (function() {

                /**
                 * Properties of a ConversationCreatedPayload.
                 * @memberof chat.realtime.v1
                 * @interface IConversationCreatedPayload
                 * @property {chat.realtime.v1.IConversation|null} [conversation] ConversationCreatedPayload conversation
                 */

                /**
                 * Constructs a new ConversationCreatedPayload.
                 * @memberof chat.realtime.v1
                 * @classdesc Represents a ConversationCreatedPayload.
                 * @implements IConversationCreatedPayload
                 * @constructor
                 * @param {chat.realtime.v1.IConversationCreatedPayload=} [properties] Properties to set
                 */
                function ConversationCreatedPayload(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * ConversationCreatedPayload conversation.
                 * @member {chat.realtime.v1.IConversation|null|undefined} conversation
                 * @memberof chat.realtime.v1.ConversationCreatedPayload
                 * @instance
                 */
                ConversationCreatedPayload.prototype.conversation = null;

                /**
                 * Creates a new ConversationCreatedPayload instance using the specified properties.
                 * @function create
                 * @memberof chat.realtime.v1.ConversationCreatedPayload
                 * @static
                 * @param {chat.realtime.v1.IConversationCreatedPayload=} [properties] Properties to set
                 * @returns {chat.realtime.v1.ConversationCreatedPayload} ConversationCreatedPayload instance
                 */
                ConversationCreatedPayload.create = function create(properties) {
                    return new ConversationCreatedPayload(properties);
                };

                /**
                 * Encodes the specified ConversationCreatedPayload message. Does not implicitly {@link chat.realtime.v1.ConversationCreatedPayload.verify|verify} messages.
                 * @function encode
                 * @memberof chat.realtime.v1.ConversationCreatedPayload
                 * @static
                 * @param {chat.realtime.v1.IConversationCreatedPayload} message ConversationCreatedPayload message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ConversationCreatedPayload.encode = function encode(message, writer, q) {
                    if (!writer)
                        writer = $Writer.create();
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    if (message.conversation != null && Object.hasOwnProperty.call(message, "conversation"))
                        $root.chat.realtime.v1.Conversation.encode(message.conversation, writer.uint32(/* id 1, wireType 2 =*/10).fork(), q + 1).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified ConversationCreatedPayload message, length delimited. Does not implicitly {@link chat.realtime.v1.ConversationCreatedPayload.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof chat.realtime.v1.ConversationCreatedPayload
                 * @static
                 * @param {chat.realtime.v1.IConversationCreatedPayload} message ConversationCreatedPayload message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ConversationCreatedPayload.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                };

                /**
                 * Decodes a ConversationCreatedPayload message from the specified reader or buffer.
                 * @function decode
                 * @memberof chat.realtime.v1.ConversationCreatedPayload
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {chat.realtime.v1.ConversationCreatedPayload} ConversationCreatedPayload
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ConversationCreatedPayload.decode = function decode(reader, length, error, long) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    if (long === undefined)
                        long = 0;
                    if (long > $Reader.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.realtime.v1.ConversationCreatedPayload();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.conversation = $root.chat.realtime.v1.Conversation.decode(reader, reader.uint32(), undefined, long + 1);
                                break;
                            }
                        default:
                            reader.skipType(tag & 7, long);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a ConversationCreatedPayload message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof chat.realtime.v1.ConversationCreatedPayload
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {chat.realtime.v1.ConversationCreatedPayload} ConversationCreatedPayload
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ConversationCreatedPayload.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a ConversationCreatedPayload message.
                 * @function verify
                 * @memberof chat.realtime.v1.ConversationCreatedPayload
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                ConversationCreatedPayload.verify = function verify(message, long) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        return "maximum nesting depth exceeded";
                    if (message.conversation != null && message.hasOwnProperty("conversation")) {
                        let error = $root.chat.realtime.v1.Conversation.verify(message.conversation, long + 1);
                        if (error)
                            return "conversation." + error;
                    }
                    return null;
                };

                /**
                 * Creates a ConversationCreatedPayload message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof chat.realtime.v1.ConversationCreatedPayload
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {chat.realtime.v1.ConversationCreatedPayload} ConversationCreatedPayload
                 */
                ConversationCreatedPayload.fromObject = function fromObject(object, long) {
                    if (object instanceof $root.chat.realtime.v1.ConversationCreatedPayload)
                        return object;
                    if (!$util.isObject(object))
                        throw TypeError(".chat.realtime.v1.ConversationCreatedPayload: object expected");
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    let message = new $root.chat.realtime.v1.ConversationCreatedPayload();
                    if (object.conversation != null) {
                        if (!$util.isObject(object.conversation))
                            throw TypeError(".chat.realtime.v1.ConversationCreatedPayload.conversation: object expected");
                        message.conversation = $root.chat.realtime.v1.Conversation.fromObject(object.conversation, long + 1);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a ConversationCreatedPayload message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof chat.realtime.v1.ConversationCreatedPayload
                 * @static
                 * @param {chat.realtime.v1.ConversationCreatedPayload} message ConversationCreatedPayload
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ConversationCreatedPayload.toObject = function toObject(message, options, q) {
                    if (!options)
                        options = {};
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    let object = {};
                    if (options.defaults)
                        object.conversation = null;
                    if (message.conversation != null && message.hasOwnProperty("conversation"))
                        object.conversation = $root.chat.realtime.v1.Conversation.toObject(message.conversation, options, q + 1);
                    return object;
                };

                /**
                 * Converts this ConversationCreatedPayload to JSON.
                 * @function toJSON
                 * @memberof chat.realtime.v1.ConversationCreatedPayload
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                ConversationCreatedPayload.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for ConversationCreatedPayload
                 * @function getTypeUrl
                 * @memberof chat.realtime.v1.ConversationCreatedPayload
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                ConversationCreatedPayload.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/chat.realtime.v1.ConversationCreatedPayload";
                };

                return ConversationCreatedPayload;
            })();

            v1.ConversationUpdatedPayload = (function() {

                /**
                 * Properties of a ConversationUpdatedPayload.
                 * @memberof chat.realtime.v1
                 * @interface IConversationUpdatedPayload
                 * @property {chat.realtime.v1.IConversation|null} [conversation] ConversationUpdatedPayload conversation
                 */

                /**
                 * Constructs a new ConversationUpdatedPayload.
                 * @memberof chat.realtime.v1
                 * @classdesc Represents a ConversationUpdatedPayload.
                 * @implements IConversationUpdatedPayload
                 * @constructor
                 * @param {chat.realtime.v1.IConversationUpdatedPayload=} [properties] Properties to set
                 */
                function ConversationUpdatedPayload(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * ConversationUpdatedPayload conversation.
                 * @member {chat.realtime.v1.IConversation|null|undefined} conversation
                 * @memberof chat.realtime.v1.ConversationUpdatedPayload
                 * @instance
                 */
                ConversationUpdatedPayload.prototype.conversation = null;

                /**
                 * Creates a new ConversationUpdatedPayload instance using the specified properties.
                 * @function create
                 * @memberof chat.realtime.v1.ConversationUpdatedPayload
                 * @static
                 * @param {chat.realtime.v1.IConversationUpdatedPayload=} [properties] Properties to set
                 * @returns {chat.realtime.v1.ConversationUpdatedPayload} ConversationUpdatedPayload instance
                 */
                ConversationUpdatedPayload.create = function create(properties) {
                    return new ConversationUpdatedPayload(properties);
                };

                /**
                 * Encodes the specified ConversationUpdatedPayload message. Does not implicitly {@link chat.realtime.v1.ConversationUpdatedPayload.verify|verify} messages.
                 * @function encode
                 * @memberof chat.realtime.v1.ConversationUpdatedPayload
                 * @static
                 * @param {chat.realtime.v1.IConversationUpdatedPayload} message ConversationUpdatedPayload message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ConversationUpdatedPayload.encode = function encode(message, writer, q) {
                    if (!writer)
                        writer = $Writer.create();
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    if (message.conversation != null && Object.hasOwnProperty.call(message, "conversation"))
                        $root.chat.realtime.v1.Conversation.encode(message.conversation, writer.uint32(/* id 1, wireType 2 =*/10).fork(), q + 1).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified ConversationUpdatedPayload message, length delimited. Does not implicitly {@link chat.realtime.v1.ConversationUpdatedPayload.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof chat.realtime.v1.ConversationUpdatedPayload
                 * @static
                 * @param {chat.realtime.v1.IConversationUpdatedPayload} message ConversationUpdatedPayload message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ConversationUpdatedPayload.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                };

                /**
                 * Decodes a ConversationUpdatedPayload message from the specified reader or buffer.
                 * @function decode
                 * @memberof chat.realtime.v1.ConversationUpdatedPayload
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {chat.realtime.v1.ConversationUpdatedPayload} ConversationUpdatedPayload
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ConversationUpdatedPayload.decode = function decode(reader, length, error, long) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    if (long === undefined)
                        long = 0;
                    if (long > $Reader.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.realtime.v1.ConversationUpdatedPayload();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.conversation = $root.chat.realtime.v1.Conversation.decode(reader, reader.uint32(), undefined, long + 1);
                                break;
                            }
                        default:
                            reader.skipType(tag & 7, long);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a ConversationUpdatedPayload message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof chat.realtime.v1.ConversationUpdatedPayload
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {chat.realtime.v1.ConversationUpdatedPayload} ConversationUpdatedPayload
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ConversationUpdatedPayload.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a ConversationUpdatedPayload message.
                 * @function verify
                 * @memberof chat.realtime.v1.ConversationUpdatedPayload
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                ConversationUpdatedPayload.verify = function verify(message, long) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        return "maximum nesting depth exceeded";
                    if (message.conversation != null && message.hasOwnProperty("conversation")) {
                        let error = $root.chat.realtime.v1.Conversation.verify(message.conversation, long + 1);
                        if (error)
                            return "conversation." + error;
                    }
                    return null;
                };

                /**
                 * Creates a ConversationUpdatedPayload message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof chat.realtime.v1.ConversationUpdatedPayload
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {chat.realtime.v1.ConversationUpdatedPayload} ConversationUpdatedPayload
                 */
                ConversationUpdatedPayload.fromObject = function fromObject(object, long) {
                    if (object instanceof $root.chat.realtime.v1.ConversationUpdatedPayload)
                        return object;
                    if (!$util.isObject(object))
                        throw TypeError(".chat.realtime.v1.ConversationUpdatedPayload: object expected");
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    let message = new $root.chat.realtime.v1.ConversationUpdatedPayload();
                    if (object.conversation != null) {
                        if (!$util.isObject(object.conversation))
                            throw TypeError(".chat.realtime.v1.ConversationUpdatedPayload.conversation: object expected");
                        message.conversation = $root.chat.realtime.v1.Conversation.fromObject(object.conversation, long + 1);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a ConversationUpdatedPayload message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof chat.realtime.v1.ConversationUpdatedPayload
                 * @static
                 * @param {chat.realtime.v1.ConversationUpdatedPayload} message ConversationUpdatedPayload
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ConversationUpdatedPayload.toObject = function toObject(message, options, q) {
                    if (!options)
                        options = {};
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    let object = {};
                    if (options.defaults)
                        object.conversation = null;
                    if (message.conversation != null && message.hasOwnProperty("conversation"))
                        object.conversation = $root.chat.realtime.v1.Conversation.toObject(message.conversation, options, q + 1);
                    return object;
                };

                /**
                 * Converts this ConversationUpdatedPayload to JSON.
                 * @function toJSON
                 * @memberof chat.realtime.v1.ConversationUpdatedPayload
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                ConversationUpdatedPayload.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for ConversationUpdatedPayload
                 * @function getTypeUrl
                 * @memberof chat.realtime.v1.ConversationUpdatedPayload
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                ConversationUpdatedPayload.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/chat.realtime.v1.ConversationUpdatedPayload";
                };

                return ConversationUpdatedPayload;
            })();

            v1.TypingUpdatedPayload = (function() {

                /**
                 * Properties of a TypingUpdatedPayload.
                 * @memberof chat.realtime.v1
                 * @interface ITypingUpdatedPayload
                 * @property {string|null} [conversationId] TypingUpdatedPayload conversationId
                 * @property {chat.realtime.v1.IUser|null} [user] TypingUpdatedPayload user
                 * @property {boolean|null} [isTyping] TypingUpdatedPayload isTyping
                 */

                /**
                 * Constructs a new TypingUpdatedPayload.
                 * @memberof chat.realtime.v1
                 * @classdesc Represents a TypingUpdatedPayload.
                 * @implements ITypingUpdatedPayload
                 * @constructor
                 * @param {chat.realtime.v1.ITypingUpdatedPayload=} [properties] Properties to set
                 */
                function TypingUpdatedPayload(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * TypingUpdatedPayload conversationId.
                 * @member {string} conversationId
                 * @memberof chat.realtime.v1.TypingUpdatedPayload
                 * @instance
                 */
                TypingUpdatedPayload.prototype.conversationId = "";

                /**
                 * TypingUpdatedPayload user.
                 * @member {chat.realtime.v1.IUser|null|undefined} user
                 * @memberof chat.realtime.v1.TypingUpdatedPayload
                 * @instance
                 */
                TypingUpdatedPayload.prototype.user = null;

                /**
                 * TypingUpdatedPayload isTyping.
                 * @member {boolean} isTyping
                 * @memberof chat.realtime.v1.TypingUpdatedPayload
                 * @instance
                 */
                TypingUpdatedPayload.prototype.isTyping = false;

                /**
                 * Creates a new TypingUpdatedPayload instance using the specified properties.
                 * @function create
                 * @memberof chat.realtime.v1.TypingUpdatedPayload
                 * @static
                 * @param {chat.realtime.v1.ITypingUpdatedPayload=} [properties] Properties to set
                 * @returns {chat.realtime.v1.TypingUpdatedPayload} TypingUpdatedPayload instance
                 */
                TypingUpdatedPayload.create = function create(properties) {
                    return new TypingUpdatedPayload(properties);
                };

                /**
                 * Encodes the specified TypingUpdatedPayload message. Does not implicitly {@link chat.realtime.v1.TypingUpdatedPayload.verify|verify} messages.
                 * @function encode
                 * @memberof chat.realtime.v1.TypingUpdatedPayload
                 * @static
                 * @param {chat.realtime.v1.ITypingUpdatedPayload} message TypingUpdatedPayload message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                TypingUpdatedPayload.encode = function encode(message, writer, q) {
                    if (!writer)
                        writer = $Writer.create();
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    if (message.conversationId != null && Object.hasOwnProperty.call(message, "conversationId"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.conversationId);
                    if (message.user != null && Object.hasOwnProperty.call(message, "user"))
                        $root.chat.realtime.v1.User.encode(message.user, writer.uint32(/* id 2, wireType 2 =*/18).fork(), q + 1).ldelim();
                    if (message.isTyping != null && Object.hasOwnProperty.call(message, "isTyping"))
                        writer.uint32(/* id 3, wireType 0 =*/24).bool(message.isTyping);
                    return writer;
                };

                /**
                 * Encodes the specified TypingUpdatedPayload message, length delimited. Does not implicitly {@link chat.realtime.v1.TypingUpdatedPayload.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof chat.realtime.v1.TypingUpdatedPayload
                 * @static
                 * @param {chat.realtime.v1.ITypingUpdatedPayload} message TypingUpdatedPayload message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                TypingUpdatedPayload.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                };

                /**
                 * Decodes a TypingUpdatedPayload message from the specified reader or buffer.
                 * @function decode
                 * @memberof chat.realtime.v1.TypingUpdatedPayload
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {chat.realtime.v1.TypingUpdatedPayload} TypingUpdatedPayload
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                TypingUpdatedPayload.decode = function decode(reader, length, error, long) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    if (long === undefined)
                        long = 0;
                    if (long > $Reader.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.realtime.v1.TypingUpdatedPayload();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.conversationId = reader.string();
                                break;
                            }
                        case 2: {
                                message.user = $root.chat.realtime.v1.User.decode(reader, reader.uint32(), undefined, long + 1);
                                break;
                            }
                        case 3: {
                                message.isTyping = reader.bool();
                                break;
                            }
                        default:
                            reader.skipType(tag & 7, long);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a TypingUpdatedPayload message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof chat.realtime.v1.TypingUpdatedPayload
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {chat.realtime.v1.TypingUpdatedPayload} TypingUpdatedPayload
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                TypingUpdatedPayload.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a TypingUpdatedPayload message.
                 * @function verify
                 * @memberof chat.realtime.v1.TypingUpdatedPayload
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                TypingUpdatedPayload.verify = function verify(message, long) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        return "maximum nesting depth exceeded";
                    if (message.conversationId != null && message.hasOwnProperty("conversationId"))
                        if (!$util.isString(message.conversationId))
                            return "conversationId: string expected";
                    if (message.user != null && message.hasOwnProperty("user")) {
                        let error = $root.chat.realtime.v1.User.verify(message.user, long + 1);
                        if (error)
                            return "user." + error;
                    }
                    if (message.isTyping != null && message.hasOwnProperty("isTyping"))
                        if (typeof message.isTyping !== "boolean")
                            return "isTyping: boolean expected";
                    return null;
                };

                /**
                 * Creates a TypingUpdatedPayload message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof chat.realtime.v1.TypingUpdatedPayload
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {chat.realtime.v1.TypingUpdatedPayload} TypingUpdatedPayload
                 */
                TypingUpdatedPayload.fromObject = function fromObject(object, long) {
                    if (object instanceof $root.chat.realtime.v1.TypingUpdatedPayload)
                        return object;
                    if (!$util.isObject(object))
                        throw TypeError(".chat.realtime.v1.TypingUpdatedPayload: object expected");
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    let message = new $root.chat.realtime.v1.TypingUpdatedPayload();
                    if (object.conversationId != null)
                        message.conversationId = String(object.conversationId);
                    if (object.user != null) {
                        if (!$util.isObject(object.user))
                            throw TypeError(".chat.realtime.v1.TypingUpdatedPayload.user: object expected");
                        message.user = $root.chat.realtime.v1.User.fromObject(object.user, long + 1);
                    }
                    if (object.isTyping != null)
                        message.isTyping = Boolean(object.isTyping);
                    return message;
                };

                /**
                 * Creates a plain object from a TypingUpdatedPayload message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof chat.realtime.v1.TypingUpdatedPayload
                 * @static
                 * @param {chat.realtime.v1.TypingUpdatedPayload} message TypingUpdatedPayload
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                TypingUpdatedPayload.toObject = function toObject(message, options, q) {
                    if (!options)
                        options = {};
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    let object = {};
                    if (options.defaults) {
                        object.conversationId = "";
                        object.user = null;
                        object.isTyping = false;
                    }
                    if (message.conversationId != null && message.hasOwnProperty("conversationId"))
                        object.conversationId = message.conversationId;
                    if (message.user != null && message.hasOwnProperty("user"))
                        object.user = $root.chat.realtime.v1.User.toObject(message.user, options, q + 1);
                    if (message.isTyping != null && message.hasOwnProperty("isTyping"))
                        object.isTyping = message.isTyping;
                    return object;
                };

                /**
                 * Converts this TypingUpdatedPayload to JSON.
                 * @function toJSON
                 * @memberof chat.realtime.v1.TypingUpdatedPayload
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                TypingUpdatedPayload.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for TypingUpdatedPayload
                 * @function getTypeUrl
                 * @memberof chat.realtime.v1.TypingUpdatedPayload
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                TypingUpdatedPayload.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/chat.realtime.v1.TypingUpdatedPayload";
                };

                return TypingUpdatedPayload;
            })();

            v1.RealtimeEvent = (function() {

                /**
                 * Properties of a RealtimeEvent.
                 * @memberof chat.realtime.v1
                 * @interface IRealtimeEvent
                 * @property {string|null} [eventId] RealtimeEvent eventId
                 * @property {chat.realtime.v1.RealtimeEventType|null} [type] RealtimeEvent type
                 * @property {string|null} [emittedAt] RealtimeEvent emittedAt
                 * @property {chat.realtime.v1.IMessageCreatedPayload|null} [messageCreated] RealtimeEvent messageCreated
                 * @property {chat.realtime.v1.IConversationCreatedPayload|null} [conversationCreated] RealtimeEvent conversationCreated
                 * @property {chat.realtime.v1.IConversationUpdatedPayload|null} [conversationUpdated] RealtimeEvent conversationUpdated
                 * @property {chat.realtime.v1.ITypingUpdatedPayload|null} [typingUpdated] RealtimeEvent typingUpdated
                 */

                /**
                 * Constructs a new RealtimeEvent.
                 * @memberof chat.realtime.v1
                 * @classdesc Represents a RealtimeEvent.
                 * @implements IRealtimeEvent
                 * @constructor
                 * @param {chat.realtime.v1.IRealtimeEvent=} [properties] Properties to set
                 */
                function RealtimeEvent(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * RealtimeEvent eventId.
                 * @member {string} eventId
                 * @memberof chat.realtime.v1.RealtimeEvent
                 * @instance
                 */
                RealtimeEvent.prototype.eventId = "";

                /**
                 * RealtimeEvent type.
                 * @member {chat.realtime.v1.RealtimeEventType} type
                 * @memberof chat.realtime.v1.RealtimeEvent
                 * @instance
                 */
                RealtimeEvent.prototype.type = 0;

                /**
                 * RealtimeEvent emittedAt.
                 * @member {string} emittedAt
                 * @memberof chat.realtime.v1.RealtimeEvent
                 * @instance
                 */
                RealtimeEvent.prototype.emittedAt = "";

                /**
                 * RealtimeEvent messageCreated.
                 * @member {chat.realtime.v1.IMessageCreatedPayload|null|undefined} messageCreated
                 * @memberof chat.realtime.v1.RealtimeEvent
                 * @instance
                 */
                RealtimeEvent.prototype.messageCreated = null;

                /**
                 * RealtimeEvent conversationCreated.
                 * @member {chat.realtime.v1.IConversationCreatedPayload|null|undefined} conversationCreated
                 * @memberof chat.realtime.v1.RealtimeEvent
                 * @instance
                 */
                RealtimeEvent.prototype.conversationCreated = null;

                /**
                 * RealtimeEvent conversationUpdated.
                 * @member {chat.realtime.v1.IConversationUpdatedPayload|null|undefined} conversationUpdated
                 * @memberof chat.realtime.v1.RealtimeEvent
                 * @instance
                 */
                RealtimeEvent.prototype.conversationUpdated = null;

                /**
                 * RealtimeEvent typingUpdated.
                 * @member {chat.realtime.v1.ITypingUpdatedPayload|null|undefined} typingUpdated
                 * @memberof chat.realtime.v1.RealtimeEvent
                 * @instance
                 */
                RealtimeEvent.prototype.typingUpdated = null;

                // OneOf field names bound to virtual getters and setters
                let $oneOfFields;

                /**
                 * RealtimeEvent payload.
                 * @member {"messageCreated"|"conversationCreated"|"conversationUpdated"|"typingUpdated"|undefined} payload
                 * @memberof chat.realtime.v1.RealtimeEvent
                 * @instance
                 */
                Object.defineProperty(RealtimeEvent.prototype, "payload", {
                    get: $util.oneOfGetter($oneOfFields = ["messageCreated", "conversationCreated", "conversationUpdated", "typingUpdated"]),
                    set: $util.oneOfSetter($oneOfFields)
                });

                /**
                 * Creates a new RealtimeEvent instance using the specified properties.
                 * @function create
                 * @memberof chat.realtime.v1.RealtimeEvent
                 * @static
                 * @param {chat.realtime.v1.IRealtimeEvent=} [properties] Properties to set
                 * @returns {chat.realtime.v1.RealtimeEvent} RealtimeEvent instance
                 */
                RealtimeEvent.create = function create(properties) {
                    return new RealtimeEvent(properties);
                };

                /**
                 * Encodes the specified RealtimeEvent message. Does not implicitly {@link chat.realtime.v1.RealtimeEvent.verify|verify} messages.
                 * @function encode
                 * @memberof chat.realtime.v1.RealtimeEvent
                 * @static
                 * @param {chat.realtime.v1.IRealtimeEvent} message RealtimeEvent message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                RealtimeEvent.encode = function encode(message, writer, q) {
                    if (!writer)
                        writer = $Writer.create();
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    if (message.eventId != null && Object.hasOwnProperty.call(message, "eventId"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.eventId);
                    if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.type);
                    if (message.emittedAt != null && Object.hasOwnProperty.call(message, "emittedAt"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.emittedAt);
                    if (message.messageCreated != null && Object.hasOwnProperty.call(message, "messageCreated"))
                        $root.chat.realtime.v1.MessageCreatedPayload.encode(message.messageCreated, writer.uint32(/* id 10, wireType 2 =*/82).fork(), q + 1).ldelim();
                    if (message.conversationCreated != null && Object.hasOwnProperty.call(message, "conversationCreated"))
                        $root.chat.realtime.v1.ConversationCreatedPayload.encode(message.conversationCreated, writer.uint32(/* id 11, wireType 2 =*/90).fork(), q + 1).ldelim();
                    if (message.conversationUpdated != null && Object.hasOwnProperty.call(message, "conversationUpdated"))
                        $root.chat.realtime.v1.ConversationUpdatedPayload.encode(message.conversationUpdated, writer.uint32(/* id 12, wireType 2 =*/98).fork(), q + 1).ldelim();
                    if (message.typingUpdated != null && Object.hasOwnProperty.call(message, "typingUpdated"))
                        $root.chat.realtime.v1.TypingUpdatedPayload.encode(message.typingUpdated, writer.uint32(/* id 13, wireType 2 =*/106).fork(), q + 1).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified RealtimeEvent message, length delimited. Does not implicitly {@link chat.realtime.v1.RealtimeEvent.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof chat.realtime.v1.RealtimeEvent
                 * @static
                 * @param {chat.realtime.v1.IRealtimeEvent} message RealtimeEvent message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                RealtimeEvent.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                };

                /**
                 * Decodes a RealtimeEvent message from the specified reader or buffer.
                 * @function decode
                 * @memberof chat.realtime.v1.RealtimeEvent
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {chat.realtime.v1.RealtimeEvent} RealtimeEvent
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                RealtimeEvent.decode = function decode(reader, length, error, long) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    if (long === undefined)
                        long = 0;
                    if (long > $Reader.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.realtime.v1.RealtimeEvent();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.eventId = reader.string();
                                break;
                            }
                        case 2: {
                                message.type = reader.int32();
                                break;
                            }
                        case 3: {
                                message.emittedAt = reader.string();
                                break;
                            }
                        case 10: {
                                message.messageCreated = $root.chat.realtime.v1.MessageCreatedPayload.decode(reader, reader.uint32(), undefined, long + 1);
                                break;
                            }
                        case 11: {
                                message.conversationCreated = $root.chat.realtime.v1.ConversationCreatedPayload.decode(reader, reader.uint32(), undefined, long + 1);
                                break;
                            }
                        case 12: {
                                message.conversationUpdated = $root.chat.realtime.v1.ConversationUpdatedPayload.decode(reader, reader.uint32(), undefined, long + 1);
                                break;
                            }
                        case 13: {
                                message.typingUpdated = $root.chat.realtime.v1.TypingUpdatedPayload.decode(reader, reader.uint32(), undefined, long + 1);
                                break;
                            }
                        default:
                            reader.skipType(tag & 7, long);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a RealtimeEvent message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof chat.realtime.v1.RealtimeEvent
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {chat.realtime.v1.RealtimeEvent} RealtimeEvent
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                RealtimeEvent.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a RealtimeEvent message.
                 * @function verify
                 * @memberof chat.realtime.v1.RealtimeEvent
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                RealtimeEvent.verify = function verify(message, long) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        return "maximum nesting depth exceeded";
                    let properties = {};
                    if (message.eventId != null && message.hasOwnProperty("eventId"))
                        if (!$util.isString(message.eventId))
                            return "eventId: string expected";
                    if (message.type != null && message.hasOwnProperty("type"))
                        switch (message.type) {
                        default:
                            return "type: enum value expected";
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                            break;
                        }
                    if (message.emittedAt != null && message.hasOwnProperty("emittedAt"))
                        if (!$util.isString(message.emittedAt))
                            return "emittedAt: string expected";
                    if (message.messageCreated != null && message.hasOwnProperty("messageCreated")) {
                        properties.payload = 1;
                        {
                            let error = $root.chat.realtime.v1.MessageCreatedPayload.verify(message.messageCreated, long + 1);
                            if (error)
                                return "messageCreated." + error;
                        }
                    }
                    if (message.conversationCreated != null && message.hasOwnProperty("conversationCreated")) {
                        if (properties.payload === 1)
                            return "payload: multiple values";
                        properties.payload = 1;
                        {
                            let error = $root.chat.realtime.v1.ConversationCreatedPayload.verify(message.conversationCreated, long + 1);
                            if (error)
                                return "conversationCreated." + error;
                        }
                    }
                    if (message.conversationUpdated != null && message.hasOwnProperty("conversationUpdated")) {
                        if (properties.payload === 1)
                            return "payload: multiple values";
                        properties.payload = 1;
                        {
                            let error = $root.chat.realtime.v1.ConversationUpdatedPayload.verify(message.conversationUpdated, long + 1);
                            if (error)
                                return "conversationUpdated." + error;
                        }
                    }
                    if (message.typingUpdated != null && message.hasOwnProperty("typingUpdated")) {
                        if (properties.payload === 1)
                            return "payload: multiple values";
                        properties.payload = 1;
                        {
                            let error = $root.chat.realtime.v1.TypingUpdatedPayload.verify(message.typingUpdated, long + 1);
                            if (error)
                                return "typingUpdated." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates a RealtimeEvent message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof chat.realtime.v1.RealtimeEvent
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {chat.realtime.v1.RealtimeEvent} RealtimeEvent
                 */
                RealtimeEvent.fromObject = function fromObject(object, long) {
                    if (object instanceof $root.chat.realtime.v1.RealtimeEvent)
                        return object;
                    if (!$util.isObject(object))
                        throw TypeError(".chat.realtime.v1.RealtimeEvent: object expected");
                    if (long === undefined)
                        long = 0;
                    if (long > $util.recursionLimit)
                        throw Error("maximum nesting depth exceeded");
                    let message = new $root.chat.realtime.v1.RealtimeEvent();
                    if (object.eventId != null)
                        message.eventId = String(object.eventId);
                    switch (object.type) {
                    default:
                        if (typeof object.type === "number") {
                            message.type = object.type;
                            break;
                        }
                        break;
                    case "REALTIME_EVENT_TYPE_UNSPECIFIED":
                    case 0:
                        message.type = 0;
                        break;
                    case "MESSAGE_CREATED":
                    case 1:
                        message.type = 1;
                        break;
                    case "CONVERSATION_CREATED":
                    case 2:
                        message.type = 2;
                        break;
                    case "CONVERSATION_UPDATED":
                    case 3:
                        message.type = 3;
                        break;
                    case "TYPING_UPDATED":
                    case 4:
                        message.type = 4;
                        break;
                    }
                    if (object.emittedAt != null)
                        message.emittedAt = String(object.emittedAt);
                    if (object.messageCreated != null) {
                        if (!$util.isObject(object.messageCreated))
                            throw TypeError(".chat.realtime.v1.RealtimeEvent.messageCreated: object expected");
                        message.messageCreated = $root.chat.realtime.v1.MessageCreatedPayload.fromObject(object.messageCreated, long + 1);
                    }
                    if (object.conversationCreated != null) {
                        if (!$util.isObject(object.conversationCreated))
                            throw TypeError(".chat.realtime.v1.RealtimeEvent.conversationCreated: object expected");
                        message.conversationCreated = $root.chat.realtime.v1.ConversationCreatedPayload.fromObject(object.conversationCreated, long + 1);
                    }
                    if (object.conversationUpdated != null) {
                        if (!$util.isObject(object.conversationUpdated))
                            throw TypeError(".chat.realtime.v1.RealtimeEvent.conversationUpdated: object expected");
                        message.conversationUpdated = $root.chat.realtime.v1.ConversationUpdatedPayload.fromObject(object.conversationUpdated, long + 1);
                    }
                    if (object.typingUpdated != null) {
                        if (!$util.isObject(object.typingUpdated))
                            throw TypeError(".chat.realtime.v1.RealtimeEvent.typingUpdated: object expected");
                        message.typingUpdated = $root.chat.realtime.v1.TypingUpdatedPayload.fromObject(object.typingUpdated, long + 1);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a RealtimeEvent message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof chat.realtime.v1.RealtimeEvent
                 * @static
                 * @param {chat.realtime.v1.RealtimeEvent} message RealtimeEvent
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                RealtimeEvent.toObject = function toObject(message, options, q) {
                    if (!options)
                        options = {};
                    if (q === undefined)
                        q = 0;
                    if (q > $util.recursionLimit)
                        throw Error("max depth exceeded");
                    let object = {};
                    if (options.defaults) {
                        object.eventId = "";
                        object.type = options.enums === String ? "REALTIME_EVENT_TYPE_UNSPECIFIED" : 0;
                        object.emittedAt = "";
                    }
                    if (message.eventId != null && message.hasOwnProperty("eventId"))
                        object.eventId = message.eventId;
                    if (message.type != null && message.hasOwnProperty("type"))
                        object.type = options.enums === String ? $root.chat.realtime.v1.RealtimeEventType[message.type] === undefined ? message.type : $root.chat.realtime.v1.RealtimeEventType[message.type] : message.type;
                    if (message.emittedAt != null && message.hasOwnProperty("emittedAt"))
                        object.emittedAt = message.emittedAt;
                    if (message.messageCreated != null && message.hasOwnProperty("messageCreated")) {
                        object.messageCreated = $root.chat.realtime.v1.MessageCreatedPayload.toObject(message.messageCreated, options, q + 1);
                        if (options.oneofs)
                            object.payload = "messageCreated";
                    }
                    if (message.conversationCreated != null && message.hasOwnProperty("conversationCreated")) {
                        object.conversationCreated = $root.chat.realtime.v1.ConversationCreatedPayload.toObject(message.conversationCreated, options, q + 1);
                        if (options.oneofs)
                            object.payload = "conversationCreated";
                    }
                    if (message.conversationUpdated != null && message.hasOwnProperty("conversationUpdated")) {
                        object.conversationUpdated = $root.chat.realtime.v1.ConversationUpdatedPayload.toObject(message.conversationUpdated, options, q + 1);
                        if (options.oneofs)
                            object.payload = "conversationUpdated";
                    }
                    if (message.typingUpdated != null && message.hasOwnProperty("typingUpdated")) {
                        object.typingUpdated = $root.chat.realtime.v1.TypingUpdatedPayload.toObject(message.typingUpdated, options, q + 1);
                        if (options.oneofs)
                            object.payload = "typingUpdated";
                    }
                    return object;
                };

                /**
                 * Converts this RealtimeEvent to JSON.
                 * @function toJSON
                 * @memberof chat.realtime.v1.RealtimeEvent
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                RealtimeEvent.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for RealtimeEvent
                 * @function getTypeUrl
                 * @memberof chat.realtime.v1.RealtimeEvent
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                RealtimeEvent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/chat.realtime.v1.RealtimeEvent";
                };

                return RealtimeEvent;
            })();

            return v1;
        })();

        return realtime;
    })();

    return chat;
})();

export { $root as default };

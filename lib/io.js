/**
 * Clase que maneja las interacciones entre el bot y el usuario.
 */
class BotIOManager {
  /**
   * El objeto que representa al Client/Bot de Eris
   * @private
   * @type {import("eris").Client}
   */
  _bot;

  /**
   * El objeto que representa al mensaje entrante
   * @private
   * @type {import("eris").Message}
   */
  _msg;

  /**
   * El objeto que representa al guild (servidor) desde donde se invoca al bot
   * @private
   * @type {import("eris").Message}
   */
  _guildID;

  /**
   * El prefijo que se utilizará para las interacciones
   * @private
   * @type {string}
   */
  _prefix;

  /**
   * Opción que señala si se deben loggear o no las acciones de I/O del bot
   * @private
   * @type {boolean}
   */
  _log;

  /**
   * Constructor de la clase BotIOManager.
   * @param {import("eris").Client} bot - El objeto Client que se está utilizando.
   * @param {string} prefix - El prefijo que se utilizará para las interacciones.
   * @param {boolean} log - Activar o desactivar logging en el bot.
   */
  constructor(bot, prefix, log) {
    this._bot = bot;
    this._prefix = prefix;
    this._log = log;
  }

  /**
   * Función que envía un mensaje al canal del usuario.
   * @param {...string} values - Los valores que se quieren incluir en el mensaje.
   */
  say = (...values) => {
    this._bot.createMessage('784212534240084041', values.join(" "));
    if (this._log) {
      console.log(`🤖 ${this._bot.user.username}: ${values.join(" ")}`);
    }
  };

  /**
   * Una función que nos devuelve una RegExp para comparar que
   * A) Se esté usando el Prefijo del Bot en el mensaje
   * y B) que el mensaje coincide con possibleString.
   * @private
   * @param {string} possibleString - La cadena con la que se quiere comparar.
   * @returns {RegExp} - Una expresión regular que se puede utilizar para comparar con el mensaje.
   */
  _prefixRegexBuilder = (possibleString) =>
    new RegExp(`^${this._prefix}${possibleString}`, "m");

  /**
   * Función que busca en el mensaje si se encuentra una cadena que coincide con una expresión regular creada con _prefixRegexBuilder.
   * @param {string} regexString - La cadena con la que se quiere comparar.
   * @returns {Array} - Un array de resultados que devuelve la función match().
   */
  match = (regexString) => {
    const match = this._msg.content.match(
      this._prefixRegexBuilder(regexString)
    );
    if (this._log && match) {
      console.log(`⚙️  Regex Match: ${this._prefixRegexBuilder(regexString)}`);
    }
    return match;
  };

  /**
   * Una función que indica que el bot está escribiendo un mensaje en el canal del usuario.
   */
  typing = () => this._bot.sendChannelTyping(this._msg.channel.id);
}

module.exports = { BotIOManager };

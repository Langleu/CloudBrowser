/**
 * @class
 * Generic Strategy which other Stragies have to follow.
 */
class GenericStrategy {
  /**
   *
   */
  constructor() {}

    /**
     *
     */
  connect = () => {};

    /**
     *
     */
  requestScreenshot = () => {};

    /**
     *
     * @param data
     */
  changeViewport = (data) => {};

    /**
     *
     * @param data
     */
  setWindowSize = (data) => {};

    /**
     *
     * @param data
     */
  mouseClick = (data) => {};

    /**
     *
     * @param data
     */
  keypress = (data) => {};

    /**
     *
     * @param data
     */
  scrollPage = (data) => {};

    /**
     *
     * @param data
     */
  urlChange = (data) => {};

    /**
     *
     * @param data
     */
  navigation = (data) => {};

    /**
     *
     * @param data
     */
  disconnect = () => {};
}

module.exports = GenericStrategy;

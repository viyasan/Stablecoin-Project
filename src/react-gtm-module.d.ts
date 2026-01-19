declare module 'react-gtm-module' {
  interface TagManagerArgs {
    gtmId: string;
    dataLayer?: object;
    dataLayerName?: string;
    events?: object;
    auth?: string;
    preview?: string;
  }

  interface DataLayerArgs {
    dataLayer: object;
    dataLayerName?: string;
  }

  const TagManager: {
    initialize: (args: TagManagerArgs) => void;
    dataLayer: (args: DataLayerArgs) => void;
  };

  export default TagManager;
}

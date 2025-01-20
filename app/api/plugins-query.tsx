import Api from './api';

const api = new Api();

const PluginQueries = {
    GET_PLUGINS: `
    query Plugins {
      plugins {
        ID
        CREATE_TIME
        CREATOR
        MODIFIER
        MODIFY_TIME
        PLUGIN_NAME
        PLUGIN_LINK
        IS_ACTIVE
        PLUGIN_GROUP_ID
        PLUGIN_TYPE_ID
        ICON
      }
    }
  `,
    GET_PLUGIN_BY_ID: `
    query PluginById($id: ID!) {
      pluginById(id: $id) {
        ID
        CREATE_TIME
        CREATOR
        MODIFIER
        MODIFY_TIME
        PLUGIN_NAME
        PLUGIN_LINK
        IS_ACTIVE
        PLUGIN_GROUP_ID
        PLUGIN_TYPE_ID
        ICON
      }
    }
  `,
};

const PluginMutations = {
    CREATE_PLUGIN: `
    mutation CreatePlugin(
      $ICON: String
      $PLUGIN_GROUP_ID: ID
      $PLUGIN_LINK: String
      $PLUGIN_NAME: String
      $PLUGIN_TYPE_ID: ID
    ) {
      createPlugins(
        ICON: $ICON
        PLUGIN_GROUP_ID: $PLUGIN_GROUP_ID
        PLUGIN_LINK: $PLUGIN_LINK
        PLUGIN_NAME: $PLUGIN_NAME
        PLUGIN_TYPE_ID: $PLUGIN_TYPE_ID
      ) {
        success
      }
    }
  `,
    UPDATE_PLUGIN: `
    mutation UpdatePlugin(
      $id: ID!
      $ICON: String
      $IS_ACTIVE: Boolean
      $PLUGIN_GROUP_ID: ID
      $PLUGIN_LINK: String
      $PLUGIN_NAME: String
      $PLUGIN_TYPE_ID: ID
    ) {
      updatePlugins(
        id: $id
        ICON: $ICON
        IS_ACTIVE: $IS_ACTIVE
        PLUGIN_GROUP_ID: $PLUGIN_GROUP_ID
        PLUGIN_LINK: $PLUGIN_LINK
        PLUGIN_NAME: $PLUGIN_NAME
        PLUGIN_TYPE_ID: $PLUGIN_TYPE_ID
      ) {
        success
      }
    }
  `,
};

export const fetchPlugins = async () => {
    try {
        const res = await api.query(PluginQueries.GET_PLUGINS);
        return res;
    } catch (error) {
        console.error('Error fetching plugins:', error);
        throw error;
    }
};

export const fetchPluginById = async (id: number) => {
    try {
        const res = await api.query(PluginQueries.GET_PLUGIN_BY_ID, { id });
        return res;
    } catch (error) {
        console.error('Error fetching plugin by ID:', error);
        throw error;
    }
};

export const createPlugin = async (input: {
    ICON: string;
    PLUGIN_GROUP_ID: string;
    PLUGIN_LINK: string;
    PLUGIN_NAME: string;
    PLUGIN_TYPE_ID: string;
}) => {
    try {
        const res = await api.mutate(PluginMutations.CREATE_PLUGIN, input);
        return res;
    } catch (error) {
        console.error('Error creating plugin:', error);
        throw error;
    }
};

export const updatePlugin = async (
    id: number,
    input: {
        ICON: string;
        IS_ACTIVE: boolean;
        PLUGIN_GROUP_ID: string;
        PLUGIN_LINK: string;
        PLUGIN_NAME: string;
        PLUGIN_TYPE_ID: string;
    }
) => {
    try {
        const res = await api.mutate(PluginMutations.UPDATE_PLUGIN, { id, ...input });
        return res;
    } catch (error) {
        console.error('Error updating plugin:', error);
        throw error;
    }
};

import { AxiosError } from 'axios';
import { PLUGINS } from '../models/Plugins';
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
    query PluginById($id: Long) {
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
      $PLUGIN_GROUP_ID: Long
      $PLUGIN_LINK: String
      $PLUGIN_NAME: String
      $PLUGIN_TYPE_ID: Int
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
      $id: Long
      $ICON: String
      $IS_ACTIVE: Boolean
      $PLUGIN_GROUP_ID: Long
      $PLUGIN_LINK: String
      $PLUGIN_NAME: String
      $PLUGIN_TYPE_ID: Int
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
  DELETE_PLUGIN: `
    mutation DeletePlugin($id: Long) {
      deletePlugins(id: $id) {
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
    const axiosError = error as AxiosError;

    // Now you can safely access 'response' and 'responseText'
    if (axiosError.response) {
      console.error('Error fetchPlugins :', axiosError.response.data);
    } else {
      console.error('Error fetchPlugins:', axiosError.message);
    }
    throw error;
  }
};

export const fetchPluginById = async (id: number) => {
  try {
    const res = await api.query(PluginQueries.GET_PLUGIN_BY_ID, { id });
    return res;
  } catch (error) {
    const axiosError = error as AxiosError;

    // Now you can safely access 'response' and 'responseText'
    if (axiosError.response) {
      console.error('Error fetchPluginById:', axiosError.response.data);
    } else {
      console.error('Error fetchPluginById:', axiosError.message);
    }
    throw error;
  }
};

export const createPlugin = async (input: PLUGINS, token?: string) => {
  try {
    const validFields = [
      'ICON',
      'IS_ACTIVE',
      'PLUGIN_GROUP_ID',
      'PLUGIN_LINK',
      'PLUGIN_NAME',
      'PLUGIN_TYPE_ID',
    ];
    const transformedInput = validateAndTransformInput(input, validFields);

    const res = await api.mutate(PluginMutations.CREATE_PLUGIN, transformedInput, token);
    return res;
  } catch (error) {
    // Type cast error to AxiosError
    const axiosError = error as AxiosError;

    // Now you can safely access 'response' and 'responseText'
    if (axiosError.response) {
      console.error('Error Create plugin:', axiosError.response.data);
    } else {
      console.error('Error Create plugin:', axiosError.message);
    }
    throw error;
  }
};

export const updatePlugin = async (
  id: number,
  input: PLUGINS, token?: string
) => {
  try {
    const validFields = [
      'ICON',
      'IS_ACTIVE',
      'PLUGIN_GROUP_ID',
      'PLUGIN_LINK',
      'PLUGIN_NAME',
      'PLUGIN_TYPE_ID',
    ];
    const transformedInput = validateAndTransformInput(input, validFields);
    const res = await api.mutate(PluginMutations.UPDATE_PLUGIN, { id, ...transformedInput }, token);
    return res;
  } catch (error) {
    // Type cast error to AxiosError
    const axiosError = error as AxiosError;

    // Now you can safely access 'response' and 'responseText'
    if (axiosError.response) {
      console.error('Error updatePlugin:', axiosError.response.data);
    } else {
      console.error('Error updatePlugin:', axiosError.message);
    }
    throw error;

  }
};
export const deletePlugin = async (id: number, token?: string) => {
  try {
    const res = await api.mutate(PluginMutations.DELETE_PLUGIN, { id }, token);
    return res;
  } catch (error) {
    // Type cast error to AxiosError
    const axiosError = error as AxiosError;

    // Now you can safely access 'response' and 'responseText'
    if (axiosError.response) {
      console.error('Error deletePlugin:', axiosError.response.data);
    } else {
      console.error('Error deletePlugin:', axiosError.message);
    }
    throw error;
  }
};
const validateAndTransformInput = (input: PLUGINS, validFields: string[]) => {


  const transformedInput: Record<string, unknown> = {};

  validFields.forEach((field) => {
    if (input[field as keyof PLUGINS] !== undefined) {
      if (field === 'PLUGIN_GROUP_ID' || field === 'PLUGIN_TYPE_ID') {
        // Do not convert to Int, keep as Long
        transformedInput[field] = input[field as keyof PLUGINS];
      } else if (field === 'id') {
        // For the ID field, ensure it's a Long
        transformedInput[field] = input[field as keyof PLUGINS];
      } else {
        transformedInput[field] = input[field as keyof PLUGINS];
      }
    }
  });

  return transformedInput;
};
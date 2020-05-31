import RNFetchBlob from 'react-native-fetch-blob';

export default class ImageUtils {
  static async getImageBase64(url: string) {
    try {
      const result = await RNFetchBlob.config({
        fileCache: true
      }).fetch('GET', url);
      const base64 = await result.base64();

      return base64;
    } catch (exception) {
      console.error(exception);
    }
  }
}

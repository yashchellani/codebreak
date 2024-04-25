/* eslint-disable */

import axios from '../../utils/axios';

class UploadFilesService {
  upload(file, question_hash, question_type, uploadProgress) {
    let formData = new FormData();

    formData.append("file", file);

    if(question_type === "Individual"){
      return axios.post(`/upload_file/${question_hash}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });
    } else {
      return axios.post(`/upload_zipfile/${question_hash}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });
    }

    
  }

}

export default new UploadFilesService();

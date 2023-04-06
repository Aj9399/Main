import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import uploadFiles from '@salesforce/apex/MyApexClass.uploadFilesWithAccessToken';

export default class UploadFilesButton extends LightningElement {
    @api recordId;
    
    handleUploadClick() {
        uploadFiles({ recordId: this.recordId })
            .then(result => {
                // Handle successful upload
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Upload file to Google Drive Successful',
                        message: 'Files uploaded successfully',
                        variant: 'success'
                    })
                );
            })
            .catch(error => {
                // Handle upload error
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Upload Error',
                        message: error.message,
                        variant: 'error'
                    })
                );
            });
    }
}

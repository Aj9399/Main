import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import uploadFile from '@salesforce/apex/FileUploaderClass.uploadFile';
import uploadFiles from '@salesforce/apex/MyApexClass.uploadFilesWithAccessToken';
import getFileCount from '@salesforce/apex/FileUploaderClass.getFileCount';


export default class FileUploaderWithGoogleDrive extends LightningElement {
    @api recordId;
    fileData;
    isUploadToGoogleDriveDisabled = true;

    openfileUpload(event) {
        const file = event.target.files[0]
        var reader = new FileReader()
        reader.onload =()=> {
            var base64 = reader.result.split(',')[1]
            this.fileData = {
                'filename': file.name,
                'base64': base64,
                'recordId': this.recordId
            }
        }
        reader.readAsDataURL(file)
    }
    
    handleClick() {
        const { base64, filename, recordId } = this.fileData;
    
        getFileCount({ recordId })
            .then(result => {
                if (result > 0) 
                {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'more than one file not allowed ',
                            message: 'File cannot uplaoded' ,
                            variant: 'error'
                })
                );
             }
                else {
                    uploadFile({ base64, filename, recordId })
                    .then(result => {
                        this.fileData = null;
                        this.isUploadToGoogleDriveDisabled = false;
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'File is uploaded to salesforce',
                                message: 'File is uploaded successfully',
                                variant: 'success'
                            })
                        )
                    });
                }
             } )
            .catch(error => {
                console.log(error);
            });
    }
    
    toast(title) {
        const toastEvent = new ShowToastEvent({
            title,
            variant
        });
        this.dispatchEvent(toastEvent);
    }





    handleUploadClick() {
        uploadFiles({ recordId: this.recordId })
            .then(result => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Upload file to Google Drive Successful',
                        message: 'Files uploaded successfully',
                        variant: 'success'
                    })
                );
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Upload Error',
                        message: error.message,
                        variant: 'error'
                    })
                );
            });
    }



    toast(title){
        const toastEvent = new ShowToastEvent({
            title, 
            variant
        })
        this.dispatchEvent(toastEvent)
    }
}

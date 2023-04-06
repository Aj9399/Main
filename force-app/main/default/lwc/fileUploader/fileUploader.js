import { LightningElement } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import GAPI_JS from '@salesforce/resourceUrl/gapi';

export default class GoogleDriveUploader extends LightningElement {
    isGAPILoaded = false;
    isGAPILoading = false;

    connectedCallback() {
        if (!this.isGAPILoading && !this.isGAPILoaded) {
            this.isGAPILoading = true;
            loadScript(this, GAPI_JS)
                .then(() => {
                    this.isGAPILoaded = true;
                    this.isGAPILoading = false;
                    gapi.load('client:auth2', () => {
                        gapi.client.init({
                            apiKey: 'YOUR_API_KEY',
                            clientId: 'YOUR_CLIENT_ID',
                            scope: 'https://www.googleapis.com/auth/drive.file'
                        }).then(() => {
                            if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
                                console.log('User is already signed in.');
                            } else {
                                gapi.auth2.getAuthInstance().signIn();
                            }
                        });
                    });
                })
                .catch(error => {
                    console.log('Error loading GAPI', error);
                });
        }
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        const metadata = {
            name: file.name,
            mimeType: file.type
        };
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = () => {
            const base64Data = btoa(reader.result);
            const data = {
                metadata: metadata,
                data: base64Data
            };
            this.uploadFileToGoogleDrive(data)
                .then(() => {
                    const toastEvent = new ShowToastEvent({
                        title: 'Success',
                        message: 'File uploaded to Google Drive successfully.',
                        variant: 'success'
                    });
                    this.dispatchEvent(toastEvent);
                })
                .catch(error => {
                    console.log('Error uploading file to Google Drive', error);
                    const toastEvent = new ShowToastEvent({
                        title: 'Error',
                        message: 'Error uploading file to Google Drive: ' + error.message,
                        variant: 'error'
                    });
                    this.dispatchEvent(toastEvent);
                });
        };
    }

    async uploadFileToGoogleDrive(data) {
        const accessToken = await this.getAccessToken();
        return new Promise((resolve, reject) => {
            gapi.client.drive.files.create({
                resource: data.metadata,
                media: {
                    mimeType: data.metadata.mimeType,
                    body: data.data
                },
                headers: {
                    Authorization: 'Bearer ' + accessToken
                }
            }).execute((response) => {
                if (response.error) {
                    reject(new Error(response.error.message));
                } else {
                    resolve();
                }
            });
        });
    }

    async getAccessToken() {
        const response = await fetch('/apex/GoogleDriveAuthController');
        if (!response.ok) {
            throw new Error('Failed to retrieve access token');
        }
        const result = await response
    }}
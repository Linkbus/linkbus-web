<template>
    <b-modal id="bv-modal-message" v-model="showModal.visible">
        <div slot="modal-header" class="m-modal-header">
            <div>
                <h5 class="modal-title">Customize School Alert</h5>
            </div>
            <button type="button" aria-label="Close" class="close" @click="hideModal">×</button>
        </div>
        <b-overlay :show="updatingDatabase" rounded="sm" variant="light" spinner-variant="primary">
            <b-form>
                <div class="d-flex">
                    <b-input-group style="width: auto">
                        <span class="mr-2">Active</span>
                        <b-form-checkbox switch v-model="message.active"></b-form-checkbox>
                    </b-input-group>
                    <b-input-group class="ml-md-4" style="width: auto">
                        <span class="mr-2">Full-width</span>
                        <b-form-checkbox switch v-model="message.fullWidth"></b-form-checkbox>
                    </b-input-group>
                </div>

                <b-input-group prepend="Action" class="mt-3" v-if="showAction">
                    <b-input-group-prepend is-text>
                        <b-form-checkbox switch v-model="message.clickable"></b-form-checkbox>
                    </b-input-group-prepend>
                    <b-form-input url v-model="message.action" :disabled="!message.clickable || message.action === null"
                                  :state="validUrl" placeholder="https://www.example.com"></b-form-input>
                </b-input-group>

                <p class="mb-0 mt-3">Background Color</p>
                <b-row class="d-flex">
                    <b-col>
                        <b-form-text class="m-0">iOS Color Palette</b-form-text>
                        <b-form-select v-model="message.color" :options="colorOptions"></b-form-select>
                    </b-col>
                    <b-col cols='auto'>
                        <p class="mt-4 mb-0">OR</p>
                    </b-col>
                    <b-col>
                        <b-form-text class="m-0">RGB Color</b-form-text>
                        <b-form-input type="color" v-model="message.colorCode" :disabled="message.color !== ''"></b-form-input>
                    </b-col>
                </b-row>
            </b-form>
        </b-overlay>
        <div slot="modal-footer">
            <b-button class="mx-1" variant="dark" @click="hideModal">Cancel</b-button>
            <b-button class="mx-1" variant="primary" @click="updateFirebase">Save</b-button>
        </div>
    </b-modal>
</template>

<script>

    import firebase from 'firebase/app'
    import {db} from "../firebase";
    const { serverTimestamp } = firebase.firestore.FieldValue;

    export default {
        name: "MessageCustomizeModal",
        components: {

        },
        props: {
            message: Object,
            showModal: Object,
            hideModal: Function,
            updateSuccessAlert: Function,
            showAction: Boolean
        },
        data() {
            return {
                colorOptions: [
                    {value: '', text: 'Use RGB'},
                    {value: 'red', text: 'Red'},
                    {value: 'green', text: 'Green'},
                    {value: 'blue', text: 'Blue'},
                    {value: 'yellow', text: 'Yellow'},
                ],
                updatingDatabase: false
            }
        },
        methods: {
            async updateFirebase() {
                this.updatingDatabase = true
                const messageData = { ...this.message }
                messageData.updated = serverTimestamp()
                messageData.rgb = this.rgb()
                try{
                    await db.doc(`messages/${this.message.id}`).set(messageData);
                    this.updateSuccessAlert('Message Saved!', 'success')
                } catch(error) {
                    console.log('ERROR:')
                    console.log(error)
                    this.updateSuccessAlert('Database communiction error', 'danger')
                }
                this.hideModal()
                this.updatingDatabase = false
            },
            rgb() {
                const hexToRgb = (color, start, end) => {
                    let value = parseInt(color.slice(start, end), 16) / 255;
                    value = Math.round(value * 100) / 100
                    if(typeof value !== "number"){
                        value = 0
                    }
                    return value
                }
                let red, green, blue, opacity;
                red = hexToRgb(this.message.colorCode,1, 3)
                green = hexToRgb(this.message.colorCode,3, 5)
                blue = hexToRgb(this.message.colorCode,5, 7)
                opacity = 1.0
                return {
                    red: red,
                    green: green,
                    blue: blue,
                    opacity: opacity
                }
            }
        },
        computed: {
            validUrl() {
                if(this.message.clickable === undefined || this.message.action === undefined || this.message.action === null){
                    return null;
                }
                if(this.message.clickable) {
                    if(this.message.action.length > 0){
                        return true;
                    }
                }
                return null;
            }
        }
    }
</script>

<style scoped>
    .m-modal-header {
        display: flex;
        justify-content: space-between;
        width: 100%;
        align-items: baseline;
    }
</style>
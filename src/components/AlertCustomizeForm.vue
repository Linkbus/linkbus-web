<template>
    <b-form>
        <div class="mb-2">
            <div class="alert-container m-0 d-flex" style="background-color: #00000012">
                <span class="alert-preview m-0" :style="alertPreviewStyle">{{ alertText }}</span>
            </div>
        </div>

        <div class="d-flex">
            <b-input-group style="width: auto">
                <span class="mr-2">Active</span>
                <b-form-checkbox switch v-model="formData.active"></b-form-checkbox>
            </b-input-group>
            <b-input-group class="ml-md-4" style="width: auto">
                <span class="mr-2">Full-width</span>
                <b-form-checkbox switch v-model="formData.fullWidth"></b-form-checkbox>
            </b-input-group>
<!--            <b-input-group class="ml-md-4" style="width: auto">-->
<!--                <span class="mr-2">Archive</span>-->
<!--                <b-form-checkbox switch v-model="formData.archived" :state="false"></b-form-checkbox>-->
<!--            </b-input-group>-->
        </div>

        <b-input-group prepend="Body" class="mt-3">
            <b-form-input :state="validBody" v-model="formData.text" required></b-form-input>
        </b-input-group>

        <b-input-group prepend="Action" class="mt-3">
            <b-input-group-prepend is-text>
                <b-form-checkbox switch v-model="formData.clickable"></b-form-checkbox>
            </b-input-group-prepend>
            <b-form-input url v-model="formData.action" :disabled="!formData.clickable"
                          :state="validUrl" placeholder="https://www.example.com"></b-form-input>
        </b-input-group>

        <p class="mb-0 mt-3">Background Color</p>
        <b-row class="d-flex">
            <b-col>
                <b-form-text class="m-0">iOS Color Palette</b-form-text>
                <b-form-select v-model="formData.color" :options="colorOptions"></b-form-select>
            </b-col>
            <b-col cols='auto'>
                <p class="mt-4 mb-0">OR</p>
            </b-col>
            <b-col>
                <b-form-text class="m-0">RGB Color</b-form-text>
                <b-form-input type="color" v-model="formData.colorCode" :disabled="formData.color !== ''"></b-form-input>
            </b-col>
        </b-row>
        <b-row class="mb-0 mt-3">
            <b-col>
                <p class="mb-1">Start time</p>
                <ChangeDate v-bind:disabled="false" v-bind:dateTime="start"/>
<!--                v-bind:dateProp="endDate" v-bind:timeProp="endTime"-->
            </b-col>
            <b-col>
                <div class="mb-1 d-flex flex-column flex-sm-row">
                    <p class="mb-1 flex-grow-1">End time</p>
                    <div class="d-flex flex-sm-row">
                        <span class="mr-2">Indefinite</span>
                        <b-form-checkbox switch v-model="indefinite.indefinite"></b-form-checkbox>
                    </div>
                </div>
                <ChangeDate v-bind:disabled="indefinite.indefinite" v-bind:dateTime="endDateTime"/>
<!--                v-bind:dateProp="endDate" v-bind:timeProp="endTime"-->
            </b-col>
        </b-row>
        <b-form-textarea
                v-model="formData.notes"
                placeholder="Notes"
                rows="1"
                max-rows="4"
        ></b-form-textarea>
    </b-form>
</template>

<script>
    import ChangeDate from "./ChangeDate";

    export default {
        name: "AlertCustomizeForm",
        components: {
            ChangeDate
        },
        props: {
            formData: Object,
            start: Object,
            end: Object,
            indefinite: Object
        },
        data() {
            return {
                colorOptions: [
                    {value: '', text: 'Use RGB'},
                    {value: 'red', text: 'Red'},
                    {value: 'green', text: 'Green'},
                    {value: 'blue', text: 'Blue'},
                    {value: 'yellow', text: 'Yellow'},
                ]
            }
        },
        methods: {
        },
        computed: {
            validUrl() {
                if(this.formData.clickable === undefined || this.formData.action === undefined){
                    return null;
                }
                if(this.formData.clickable) {
                    if(this.formData.action.length > 0){
                        return true;
                    }
                }
                return null;
            },
            validBody() {
                if(this.formData.text === undefined){
                    return null;
                }
                if(this.formData.text.length === 0){
                    return null
                } else if (this.formData.text.length < 5){
                    return false;
                }
                return true;
            },
            endDateTime() {
                if(this.indefinite.indefinite) {
                    return {
                        start: "",
                        end: ""
                    }
                }
                // this.formData.end.date = this.formData.start.date
                // this.formData.end.time = this.formData.start.time
                return this.end
            },
            alertPreviewStyle() {
                let bg = ''
                if(this.formData.color === ''){
                    bg = this.formData.colorCode;
                } else {
                    bg = this.formData.color;
                }
                let width = ""
                if(this.formData.fullWidth) {
                    width = "100%";
                } else {
                    width = "auto";
                }
                return `background-color: ${bg}; width: ${width}`;
            },
            alertText() {
                if(this.formData.text.length === 0){
                    return "Sample alert message"
                }
                return this.formData.text;
            }
        }
    }
</script>

<style scoped>
    .alert-container {
        border: solid 0;
        border-radius: 1em;
    }
    .alert-preview {
        color: white;
        font-size: 1em;
        border: solid 0;
        border-radius: 1em;
        padding: 0.5em;
    }
</style>
<template>
    <b-modal id="bv-modal-edit" v-model="showModal.visible">
        <div slot="modal-header" class="m-modal-header">
            <div>
                <h5 class="modal-title">Edit Alert</h5>
                <p class="m-0 small text-muted">ID: {{ alertDoc.id }}</p>
            </div>
            <button type="button" aria-label="Close" class="close" @click="hideModal">×</button>
        </div>
        <b-overlay :show="updatingDatabase" rounded="sm" variant="light" spinner-variant="primary">
            <AlertCustomizeForm v-bind:formData="formData" v-bind:start="start" v-bind:end="end"
                                 v-bind:indefinite="indefinite"/>
        </b-overlay>
        <div slot="modal-footer">
            <b-button class="mx-1" variant="dark" @click="hideModal">Cancel</b-button>
<!--             class="needs-validation" novalidate @submit="checkForm"-->
            <b-button class="mx-1" variant="primary" @click="updateFirebase">Save</b-button>
        </div>
    </b-modal>
</template>

<script>
    import {db} from "../firebase";
    import AlertCustomizeForm from "./AlertCustomizeForm";
    import firebase from 'firebase/app'
    const { serverTimestamp } = firebase.firestore.FieldValue;

    const getDateTime = (dateTime) => {
        // console.log(dateTime)
        return `${dateTime.date} ${dateTime.time}`
    }

    export default {
        name: "CustomModal",
        components: {
          AlertCustomizeForm
        },
        props: {
            alertDoc: Object,
            showModal: Boolean,
            hideModal: Function,
            updateSuccessAlert: Function,
            user: Object
        },
        data() {
            return {
                // Placeholder values
                formData: {},
                updatingDatabase: false,
                indefinite: {
                    indefinite: true
                },
                start: {
                    date: "",
                    time: ""
                },
                end: {
                    date: "",
                    time: ""
                }
            }
        },
        methods: {
            async updateFirebase() {
                this.updatingDatabase = true
                const alertData = { ...this.formData }
                alertData.updated = serverTimestamp()
                alertData.rgb = this.rgb()
                alertData.start = firebase.firestore.Timestamp.fromDate(new Date(getDateTime(this.start)));
                if(!this.indefinite.indefinite){
                    alertData.end = firebase.firestore.Timestamp.fromDate(new Date(getDateTime(this.end)));
                } else {
                    alertData.end = ""
                }
                // Convert rgb to color code
                try{
                    await db.doc(`alerts/${this.alertDoc.id}`).set(alertData);
                    this.updateSuccessAlert('Alert Saved!', 'success')
                } catch(error) {
                    console.log('ERROR:')
                    console.log(error)
                    this.updateSuccessAlert('Database communiction error', 'danger')
                }
                this.hideModal()
                this.updatingDatabase = false
            },
            parseDateTime() {
                // if(typeof this.formData.start === "string" && this.formData.start !== ""){
                // const [startDate, startTime] = this.formData.start.split(" ")
                function toDateTime(seconds) {
                    const time = new Date(Date.UTC(1970, 0, 1)); // Epoch
                    time.setUTCSeconds(seconds);
                    return time;
                }
                const getDate = (date) => {
                    const dd = date.getDate();
                    const mm = date.getMonth()+1;
                    const yyyy = date.getFullYear();
                    return `${yyyy}-${mm}-${dd}`
                }
                const getTime = (time) => {
                    const hour = time.getHours()
                    const minute = time.getMinutes()
                    return `${hour}:${minute}:00`
                }
                const start = toDateTime(this.formData.start.seconds)
                this.start.date = getDate(start)
                this.start.time = getTime(start)
                if(this.formData.end !== "") {
                    this.indefinite.indefinite = false
                    const end = toDateTime(this.formData.end.seconds)
                    this.end.date = getDate(end)
                    this.end.time = getTime(end)
                } else {
                    this.indefinite.indefinite = true
                    this.end.date = this.start.date
                    this.end.time = this.start.time
                }
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
                red = hexToRgb(this.formData.colorCode,1, 3)
                green = hexToRgb(this.formData.colorCode,3, 5)
                blue = hexToRgb(this.formData.colorCode,5, 7)
                opacity = 1.0
                return {
                    red: red,
                    green: green,
                    blue: blue,
                    opacity: opacity
                }
            },
        },
        watch: {
            alertDoc: {
                handler(alertDoc) {
                    if(alertDoc.start !== undefined && alertDoc.text !== undefined){
                        // console.log(alertDoc.start);
                        // console.log(alertDoc.end.seconds);
                        // console.log(firebase.firestore.Timestamp.now().seconds)
                        this.formData = { ...alertDoc }
                        this.parseDateTime()
                    }
                }
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
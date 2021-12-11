<template>
    <b-row class="cols-12 col-sm-5 col-md-4 m-0 p-0 mt-3">
        <b-col>
            <b-card class="text-center">
                <p slot="header" class="m-0" style="font-size: 1em">School Alerts Customization</p>
                <div class="d-flex justify-content-around">
                    <b-button size="sm" variant="outline-primary" class="mr-2" @click="setMessage(0); openModal()">
                        Bus Message
                    </b-button>
                    <b-button size="sm" variant="outline-primary" class="mr-2" @click="setMessage(1); openModal()">
                        Campus Alert
                    </b-button>
                </div>
            </b-card>
        </b-col>
        <MessageCustomizeModal v-bind:showModal="showModal" v-bind:hideModal="hideModal" v-bind:message="messageSelected"
                               v-bind:updateSuccessAlert="updateSuccessAlert" v-bind:showAction="showAction"/>
    </b-row>
</template>

<script>
    import MessageCustomizeModal from "./MessageCustomizeModal";
    import { db } from "../firebase";

    const messagesCollection = db.collection('messages');
    export default {
        name: "BusMessage",
        components: {
            MessageCustomizeModal
        },
        props: {
            updateSuccessAlert: Function
        },
        data() {
            return {
                showModal: false,
                messageDocs: [],
                messageSelected: {},
                showAction: true
            }
        },
        firestore() {
            // const messageDocs = messagesCollection
                // .where('uid', '==', adminUserId); // No UID for daily message yet
            return {
                messageDocs: messagesCollection
            }
        },
        methods: {
            openModal() {
                this.showModal = true;
            },
            hideModal() {
                this.showModal = false;
            },
            setMessage(index) {
                for(let i = 0; i < this.messageDocs.length; i++) {
                    if(this.messageDocs[i].msgId === index) {
                        this.showAction = index !== 1;
                        this.messageSelected = this.messageDocs[i];
                        break;
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
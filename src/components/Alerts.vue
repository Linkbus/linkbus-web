<template>
    <div class="my-3">
        <div class="d-flex px-2 px-sm-0" style="align-items: flex-end;">
            <h3 class="mr-3 mb-0" style="flex-grow: 1;">Alerts</h3>
            <b-button size="sm" variant="outline-primary" class="create-button m-1"
                      @click="openCreateModal" v-if="signedIn">
                Create Alert
            </b-button>
        </div>
        <hr class="m-0" />
        <div class="alerts-container p-2 p-sm-3">
            <div v-if="alerts.length === 0 && loading" class="d-flex justify-content-around mt-3">
                <b-spinner variant="primary" label="Spinning"></b-spinner>
            </div>
            <div v-else>
                <AlertGroup v-bind:alerts="alertsActive" v-bind:openEditModal="openEditModal"
                            v-bind:openDeleteModal="openDeleteModal" v-bind:signedIn="signedIn"
                            v-bind:alertEnd="alertEnd" v-bind:orderUp="orderUp" v-bind:orderDown="orderDown"
                            v-bind:groupName="'Active'" v-bind:showByDefault="true" />
                <AlertGroup v-bind:alerts="alertsInactive" v-bind:openEditModal="openEditModal"
                            v-bind:openDeleteModal="openDeleteModal" v-bind:signedIn="signedIn"
                            v-bind:alertEnd="alertEnd" v-bind:orderUp="orderUp" v-bind:orderDown="orderDown"
                            v-bind:groupName="'Inactive'" v-bind:showByDefault="false" />
<!--                <AlertGroup v-bind:alerts="alertsExpired" v-bind:openEditModal="openEditModal"-->
<!--                            v-bind:openDeleteModal="openDeleteModal" v-bind:signedIn="signedIn"-->
<!--                            v-bind:alertEnd="alertEnd" v-bind:orderUp="orderUp" v-bind:orderDown="orderDown"-->
<!--                            v-bind:groupName="'Expired'" v-bind:showByDefault="false" />-->
            </div>

<!--            <div v-else-if="alerts.length > 0">-->
<!--                <div class="d-none d-md-block">-->
<!--                    <draggable v-model="alertsSorted" ghost-class="ghost" animation="200" @end="onEndMove">-->
<!--                        <Alert v-for="alert in alertsSorted" v-bind:key="alert.id" v-bind:text="alert.text"-->
<!--                               v-bind:action="alert.action" v-bind:clickable="alert.clickable" v-bind:alertDoc="alert"-->
<!--                               v-bind:openEditModal="openEditModal" v-bind:openDeleteModal="openDeleteModal"-->
<!--                               v-bind:active="alert.active" v-bind:fullWidth="alert.fullWidth"-->
<!--                               v-bind:color="alert.color" v-bind:colorCode="alert.colorCode" v-bind:signedIn="signedIn"-->
<!--                               v-bind:start="alert.start" v-bind:end="alertEnd(alert.end)"/>-->
<!--                    </draggable>-->
<!--                </div>-->
<!--                <div class="d-block d-md-none">-->
<!--                    <transition-group name="list">-->
<!--                        <Alert v-for="alert in alertsSorted" v-bind:key="alert.id" v-bind:text="alert.text"-->
<!--                               v-bind:action="alert.action" v-bind:clickable="alert.clickable" v-bind:alertDoc="alert"-->
<!--                               v-bind:openEditModal="openEditModal" v-bind:openDeleteModal="openDeleteModal"-->
<!--                               v-bind:active="alert.active" v-bind:fullWidth="alert.fullWidth"-->
<!--                               v-bind:color="alert.color" v-bind:colorCode="alert.colorCode" v-bind:signedIn="signedIn"-->
<!--                               v-bind:start="alert.start" v-bind:end="alertEnd(alert.end)" v-bind:order="alert.order"-->
<!--                               v-bind:orderUp="orderUp" v-bind:orderDown="orderDown"/>-->
<!--                    </transition-group>-->
<!--                </div>-->
<!--            </div>-->
<!--            <div>-->
<!--                <div class="d-flex archived-text" @click="toggleArchived">-->
<!--                    <p style="color: #007bff" class="m-0">Archived ({{ alertsArchived.length }})</p>-->
<!--                    <BIconTriangle rotate="180" variant="primary" class="archived-icon m-1" v-if="showArchived"/>-->
<!--                    <BIconTriangle variant="primary" class="archived-icon m-1" v-else/>-->
<!--                </div>-->
<!--                <hr class="archived-line" />-->
<!--                <div v-if="showArchived">-->
<!--                    <Alert v-for="alert in alertsArchived" v-bind:key="alert.id" v-bind:text="alert.text"-->
<!--                           v-bind:action="alert.action" v-bind:clickable="alert.clickable" v-bind:alertDoc="alert"-->
<!--                           v-bind:openEditModal="openEditModal" v-bind:openDeleteModal="openDeleteModal"-->
<!--                           v-bind:active="alert.active" v-bind:fullWidth="alert.fullWidth"-->
<!--                           v-bind:color="alert.color" v-bind:colorCode="alert.colorCode" v-bind:signedIn="signedIn"-->
<!--                           v-bind:start="alert.start" v-bind:end="alertEnd(alert.end)" v-bind:order="alert.order"-->
<!--                           v-bind:orderUp="orderUp" v-bind:orderDown="orderDown"/>-->
<!--                </div>-->
<!--            </div>-->
        </div>

        <DeleteModal v-bind:showModal="showDeleteModal" v-bind:hideModal="hideDeleteModal"
                     v-bind:alertDoc="clickedAlert" v-bind:updateSuccessAlert="updateSuccessAlert"
                     v-bind:user="user"/>
        <EditModal v-bind:showModal="showEditModal" v-bind:hideModal="hideEditModal" v-bind:alertDoc="clickedAlert"
                   v-bind:updateSuccessAlert="updateSuccessAlert" v-bind:user="user"/>
        <CreateModal v-bind:showModal="showCreateModal" v-bind:hideModal="hideCreateModal"
                     v-bind:updateSuccessAlert="updateSuccessAlert" v-bind:user="user" v-bind:order="newOrder"/>
    </div>
</template>

<script>
    // import Alert from "./Alert";
    import DeleteModal from "./DeleteAlertModal";
    import EditModal from "./EditAlertModal";
    import CreateModal from "./CreateAlertModal";
    import AlertGroup from "./AlertGroup";
    import {db} from "../firebase";
    import firebase from "firebase";
    // import draggable from 'vuedraggable'
    // import { BIconTriangle } from 'bootstrap-vue'

    const alertsCollection = db.collection('alerts');

    const adminUserId = process.env.VUE_APP_FIREBASE_USER_ID;

    export default {
        name: "Alerts",
        components: {
            DeleteModal, EditModal, CreateModal, AlertGroup // draggable, BIconTriangle, Alert,
        },
        props: {
            updateSuccessAlert: Function,
            signedIn: Boolean,
            user: Object,
        },
        data() {
            return {
                formData: {},
                alerts: [],
                alertsActive: [],
                alertsInactive: [],
                // alertsExpired: [],
                showEditModal: false,
                showDeleteModal: false,
                showCreateModal: false,
                clickedAlert: {},
                loading: true,
                drag: false,
                showActive: true,
                showInactive: false,
                showExpired: false
            }
        },
        firestore() {
            const alertDocs = alertsCollection
                .where('uid', '==', adminUserId);
            return {
                alerts: alertDocs
            }
        },
        methods: {
            openEditModal(alertDoc) {
                this.clickedAlert = alertDoc;
                this.showEditModal = true;
            },
            hideEditModal() {
                this.showEditModal = false;
                this.clickedAlert = {};
            },
            openDeleteModal(alertDoc) {
                this.clickedAlert = alertDoc;
                this.showDeleteModal = true;
            },
            hideDeleteModal() {
                this.showDeleteModal = false;
                this.clickedAlert = {};
            },
            openCreateModal() {
                this.showCreateModal = true;
            },
            hideCreateModal() {
                this.showCreateModal = false;
            },
            alertEnd(end) {
                if(end === "") {
                    return {};
                }
                return end;
            },
            // async onEndMove() {
            //     const batch = db.batch();
            //     for(let i = 0; i < this.alertsSorted.length; i++){
            //         const alert = this.alertsSorted[i];
            //         alert.order = i;
            //         let doc = db.doc(`alerts/${alert.id}`)
            //         batch.set(doc, alert);
            //     }
            //     await batch.commit();
            // },
            sortAlerts() {
                let alertsTmp = [...this.alerts];
                alertsTmp.sort((a, b) => a.order - b.order)
                this.alertsActive = alertsTmp.filter(alert => alert.active === true && !this.isExpired(alert));
                this.alertsInactive = alertsTmp.filter(alert => alert.active === false || this.isExpired(alert));
                // this.alertsExpired = alertsTmp.filter(alert => alert.active === true && this.isExpired(alert));
            },
            isExpired(alert) {
                if(alert.end === "") {
                    return false
                }
                return alert.end.seconds < firebase.firestore.Timestamp.now().seconds
            },
            orderUp(index) {
                if(index > 0) {
                    let alertsTmp = [...this.alertsSorted];
                    alertsTmp[index].order = index - 1;
                    alertsTmp[index - 1].order = index;
                    // console.log(alertsTmp[index].order)
                    // console.log(alertsTmp[index - 1].order)
                    this.alerts = [...alertsTmp];
                    this.updateOrder(index, -1);
                }
            },
            orderDown(index) {
                if(index >= 0 && index < this.alertsSorted.length - 1) {
                    let alertsTmp = [...this.alertsSorted];
                    alertsTmp[index].order = index + 1;
                    alertsTmp[index + 1].order = index;
                    // console.log(alertsTmp[index].order)
                    // console.log(alertsTmp[index - 1].order)
                    this.alerts = [...alertsTmp];
                    this.updateOrder(index, 1);
                }
            },
            async updateOrder(index, change) {
                const batch = db.batch();
                let alert = this.alerts[index];
                let doc = db.doc(`alerts/${alert.id}`)
                batch.set(doc, alert);
                alert = this.alerts[index + change];
                doc = db.doc(`alerts/${alert.id}`)
                batch.set(doc, alert);
                await batch.commit();
            }
        },
        created: function () {
            setTimeout(function() {
                this.loading = false
            }.bind(this),5000);
        },
        computed: {
            newOrder() {
                return this.alertsActive.length;
            }
        },
        watch: {
            alerts() {
                this.sortAlerts();
            }
        }
    }
</script>

<style scoped>
    .alerts-container {
        background: #ebecf0;
    }
    .ghost {
        border-left: solid #007bff 6px;
    }
    .list-move {
        transition: transform 500ms;
    }

</style>
<template>
    <div>
        <div class="d-flex archived-text" @click="toggleGroup">
            <p style="color: #007bff" class="m-0">{{ groupName }} ({{ alerts.length }})</p>
            <div v-if="alerts.length > 0">
                <BIconTriangle rotate="180" variant="primary" class="archived-icon m-1" v-if="showAlerts"/>
                <BIconTriangle variant="primary" class="archived-icon m-1" v-else/>
            </div>
        </div>
        <hr class="archived-line" />
        <div v-if="showAlerts">
            <div v-if="alerts.length > 0">
                <div class="d-none d-md-block">
                    <draggable v-model="alerts" ghost-class="ghost" animation="200" @end="onEndMove">
                        <Alert v-for="alert in alerts" v-bind:key="alert.id" v-bind:text="alert.text"
                               v-bind:action="alert.action" v-bind:clickable="alert.clickable" v-bind:alertDoc="alert"
                               v-bind:openEditModal="openEditModal" v-bind:openDeleteModal="openDeleteModal"
                               v-bind:active="alert.active" v-bind:fullWidth="alert.fullWidth"
                               v-bind:color="alert.color" v-bind:colorCode="alert.colorCode" v-bind:signedIn="signedIn"
                               v-bind:start="alert.start" v-bind:end="alertEnd(alert.end)" v-bind:order="alert.order"
                               v-bind:orderUp="orderUp" v-bind:orderDown="orderDown" />
                    </draggable>
                </div>
                <div class="d-block d-md-none">
                    <transition-group name="list">
                        <Alert v-for="alert in alerts" v-bind:key="alert.id" v-bind:text="alert.text"
                               v-bind:action="alert.action" v-bind:clickable="alert.clickable" v-bind:alertDoc="alert"
                               v-bind:openEditModal="openEditModal" v-bind:openDeleteModal="openDeleteModal"
                               v-bind:active="alert.active" v-bind:fullWidth="alert.fullWidth"
                               v-bind:color="alert.color" v-bind:colorCode="alert.colorCode" v-bind:signedIn="signedIn"
                               v-bind:start="alert.start" v-bind:end="alertEnd(alert.end)" v-bind:order="alert.order"
                               v-bind:orderUp="orderUp" v-bind:orderDown="orderDown" />
                    </transition-group>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Alert from "./Alert";
    import { BIconTriangle } from 'bootstrap-vue'
    import draggable from 'vuedraggable'
    import {db} from "../firebase";

    export default {
        name: "AlertGroup",
        components: {
            Alert, BIconTriangle, draggable
        },
        props: {
            alerts: Array,
            openEditModal: Function,
            openDeleteModal: Function,
            signedIn: Boolean,
            alertEnd: Function,
            orderUp: Function,
            orderDown: Function,
            groupName: String,
            showByDefault: Boolean
        },
        data() {
            return {
                showAlerts: false
            }
        },
        methods: {
            toggleGroup() {
                this.showAlerts = !this.showAlerts;
            },
            async onEndMove() {
                const batch = db.batch();
                for(let i = 0; i < this.alerts.length; i++){
                    const alert = this.alerts[i];
                    alert.order = i;
                    let doc = db.doc(`alerts/${alert.id}`)
                    batch.set(doc, alert);
                }
                await batch.commit();
            }
        },
        watch: {
            showByDefault: {
                immediate: true,
                handler(showAlerts) {
                    this.showAlerts = showAlerts
                }
            },
        }
    }
</script>

<style scoped>
    hr {
        margin-top: 0;
    }
    .archived-text {
        cursor: pointer
    }
    .archived-line {
        background: #007bff
    }
    .archived-icon {
        font-size: 0.8em;
    }
</style>
<template>
    <div>
        <sui-modal v-model="open" size="small">
            <sui-modal-header>History</sui-modal-header>
            <sui-modal-content>
                <sui-list divided relaxed>
                    <sui-list-item>
                        <sui-list-content v-for="item in items" v-bind:key="item._id">
                            <a is="sui-list-header">{{ item.url }}</a>
                            <a is="sui-list-description">{{ item.date }}</a>
                        </sui-list-content>
                    </sui-list-item>
                </sui-list>
            </sui-modal-content>
            <sui-modal-actions>
                <sui-button positive @click.native="toggle">
                    OK
                </sui-button>
            </sui-modal-actions>
        </sui-modal>
    </div>
</template>

<script>
    export default {
        name: "history",
        props: [ 'items' ],
        data() {
            return { open: false };
        },
        methods: {
            toggle() {
                this.open = !this.open;
            },
        }
    }
</script>

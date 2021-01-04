<template>
    <div>
        <el-table
                ref="dataTable"
                v-loading="loading"
                :data="tableData"
                v-bind="$attrs"
                :row-key="rowKey"
                v-on="listeners"
                style="width: 100%" :height="height"
                :empty-text="$t('Common.no_data_found')"
        >
            <slot name="columns">
                <el-table-column
                        :sortable="column.sortable ? 'custom' : false"
                        v-for="column in columns"
                        :key="column.prop"
                        v-bind="column" v-if="column.type == 'selection'">  </el-table-column>
                <el-table-column
                        :sortable="column.sortable ? 'custom' : false"
                        v-for="column in columns"
                        :key="column.prop"
                        v-bind="column" v-if="column.type != 'selection'">
                    <template slot-scope="{row}">
                        <slot :name="column.prop || column.type || column.label" :row="row" >
                            {{row[column.prop]}}
                        </slot>
                    </template>
                </el-table-column>
            </slot>
        </el-table>
        <slot name="pagination" :page="page" :total="total">
            <el-pagination
                    v-model="page"
                    v-on="pageListeners"
                    :total="total"
                    :page-size.sync="size"
                    @current-change="getTableData"
                    :current-page="current_page"
                    layout="total, sizes, prev, pager, next"
            >
            </el-pagination>
        </slot>
    </div>
</template>

<script>
    export default {
        name: 'DataTable',
        inheritAttrs: false,
        props: {
            columns: {
                type: Array,
                default: () => []
            },
            rowKey:{
                type: String,
                default: () => ''
            },
            getData: {
                type: Function,
                default: () => Promise.resolve([])
            },
            expandTable:{
                type: Function,
                default: () => Promise.resolve([])
            },
            selectChange:{
                type: Function,
                default: () => Promise.resolve([])
            },
            selectAllRow:{
                type: Function,
                default: () => Promise.resolve([])
            },
            selectRow:{
                type: Function,
                default: () => Promise.resolve([])
            },
            rowClick:{
                type: Function,
                default: () => Promise.resolve([])
            }
        },
        data () {
            return {
                tableData: [],
                page: 1,
                current_page: 1,
                size: 20,
                total: 20,
                sortParams: [],
                loading: false,
                selectedData: [],
                height: 'auto',
            }
        },
        computed: {
            listeners () {
                return {
                    ...this.$listeners,
                    'sort-change': this.onSortChange,
                    'expand-change': this.expandChange,
                    'selection-change': this.selectionChange,
                    'selection-all': this.selectionAll,
                    'select': this.selectCheckboxRow,
                    'row-click': this.handleRowClick
                }
            },
            pageListeners () {
                return {
                    ...this.$pageListeners,
                    'size-change': this.pageSizeChange
                }
            }
        },
        methods: {
            async getTableData (page) {
                this.loading = true
                const reqPage = page || this.page
                try {
                    const response = await this.getData({
                        page: reqPage,
                        sortParams: this.sortParams,
                        size : this.size
                    })
                    this.tableData = response.data
                    this.total = response.total
                    this.size = response.size
                    this.selectedData= response.selectedData
                    this.height= response.height
                    this.current_page = reqPage

                } finally {
                    this.loading = false
                }
            },

            async clearSelection(rows) {
                this.$refs.dataTable.clearSelection();
            },

            async toggleRowExpansion(rows){
                this.$refs.dataTable.toggleRowExpansion(rows);
            },

            async toggleRowSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.dataTable.toggleRowSelection(row);
                    });
                    this.$refs.dataTable.doLayout();
                }
            },

            async expandChange (row, expandedRows) {
                try {
                    await this.expandTable(row, expandedRows)
                } finally {
                }
            },

            async selectionChange (selection) {
                try {
                    await this.selectChange(selection)
                } finally {
                }
            },

            async selectionAll (selection) {
                try {
                    await this.selectAllRow(selection)
                } finally {
                }
            },

            async selectCheckboxRow (selection, row) {
                try {
                    await this.selectRow(selection, row)
                } finally {
                }
            },

            async handleRowClick(row) {
                try {
                    await this.rowClick(row)
                } finally {
                }
            },

            onSortChange ({ column, prop, order }) {
                if (prop !== null) {
                    const shortOrder = order === 'ascending' ? 'asc' : 'desc'
                    this.sortParams = [`${prop}-${shortOrder}`]
                } else {
                    this.sortParams = []
                }
                this.getTableData()
            },

            pageSizeChange () {
                this.$nextTick(() => {
                    this.getTableData()
                })
            },
        },
        created () {
            this.getTableData()
        },
        watch: {
            loading: function(_el) {
                if(!_el){
                    setTimeout(() => {
                        this.toggleRowSelection(this.selectedData);
                    }, 500)
                }
            }
        }
    }
</script>
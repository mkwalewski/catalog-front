<template>
  <div class="p-xs">
    <!--
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    -->
    <div class="col-md-4 panel-left color-bg-light-vivid-mid">
      <ul class="nav nav-tabs theme-alt color-fill-accent-vivid-mid1 color-bg-dark-neutral-mid" role="tablist">
        <li role="presentation" class="active"><a href="#disks" aria-controls="disks" role="tab" data-toggle="tab">Dyski</a></li>
        <li role="presentation"><a href="#catalogs" aria-controls="catalogs" role="tab" data-toggle="tab">Katalogi</a></li>
      </ul>
      <div class="tab-content">
          <div role="tabpanel" class="tab-pane active" id="disks">

          </div>
          <div role="tabpanel" class="tab-pane" id="catalogs">
              <catalog-buttons />
              <catalog-tree />
          </div>
      </div>
    </div>
      <div class="col-md-19 col-md-offset-1 panel-right color-bg-light-vivid-mid">
          <catalog-files />
      </div>
  </div>
</template>

<script>
    // @ is an alias to /src
    import CatalogButtons from '@/components/CatalogButtons.vue'
    import CatalogTree from '@/components/CatalogTree.vue'
    import CatalogFiles from '@/components/CatalogFiles.vue'

    export default {
        name: 'home',
        components: {
            CatalogButtons,
            CatalogTree,
            CatalogFiles
        },
        data: function () {
            return {

            }
        }
    }
</script>

<style lang="scss">
  .panel-left {
    border: 1px solid rgba(0,0,0,.3);
  }
  .panel-right {
      min-height: 100px !important;
      border: 1px solid rgba(0,0,0,.3);
  }
</style>

<style scoped>

</style>

<template>
  <div class="">
      <div class="h-fit w-fit border-2 border-red-400">
        <div>
          Old
        </div>
        <div>
          {{ oldText }}
        </div>
      </div>
      <div class="h-fit w-fit border-2 border-blue-400">
        <div>
          New
        </div>
        <div>
          {{ newText }}
        </div>
      </div>
      <div class="h-fit w-fit border-2 border-yellow-400">
        <div>
          Compare
        </div>
        <div class="display">
          {{ comparedOutput }}
          <pre id="display"></pre>
        </div>
      </div>
  </div>
</template>

<script src="./app.ts"></script>

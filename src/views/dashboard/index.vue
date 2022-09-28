<template>
  <div>
    <Card></Card>
    <Sale></Sale>
    <Observe></Observe>
  </div>
</template>

<script>
import Card from "./card";
import Sale from "./sale";
import Observe from "./observe";

export default {
  name: "Dashboard",
  components: {
    Card,
    Sale,
    Observe,
  },
  mounted() {
    this.$store.dispatch("getData");
  },
};
</script>

<style scoped>
</style>

<template>
    <div id="loader">
        <div id="spinner"></div>
    </div>
</template>

<script>
</script>

<style lang="css" scoped>
#loader {
    box-sizing : border-box;
    width: 100%;
    padding: 25px;
    text-align: center;
}
#spinner {
    border: 10px solid #f3f3f3; /* Light grey */
    border-top: 10px solid #2196F3; /* Blue */
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: inline-block;
    animation: spin 2s linear infinite;
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>

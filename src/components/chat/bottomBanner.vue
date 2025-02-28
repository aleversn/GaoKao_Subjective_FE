<template>
<div class="ICP-bottom-banner-block">
    <span><a href="https://beian.miit.gov.cn/#/Integrated/index">闽ICP备2023010064号</a> | © 福州零壹拾光网络有限公司</span>
</div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
.ICP-bottom-banner-block
{
    @include HendVcenter;
    
    position: fixed;
    width: 100%;
    left: 0px;
    bottom: 0px;
    height: 35px;

    span
    {
        margin: 0px 5px;
        font-size: 12px;
        color: rgba(120, 120, 120, 1);

        a
        {
            color: rgba(120, 120, 120, 1);
            text-decoration: none;

            &:hover
            {
                text-decoration: underline;
            }
        }
    }
}
</style>
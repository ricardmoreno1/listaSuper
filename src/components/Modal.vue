
<script>
export default {
  name: 'Modal',
  props: {
    show: {
      type: Boolean,
      default: true
    }
  },
  render () {
    return (this.show) ? <div class="modall-wrapper">
      <div>
        <div class="modall bg-white p-4 shadow-lg">
          <div class="modall-head text-right">
            <button onClick={this.onClose}>CerrarIn</button>
            <a href="#" onClick={this.onClose}>
              <i class="material-icons modal-close-icon">close</i>
            </a>
          </div>
          <div class="modall-content">
            {this.$slots.default}

            <button onClick={this.clickCancelHandler}>Cancelar</button>
            <button onClick={this.clickOkHandler}>Ok</button>

          </div>

        </div>
      </div>
    </div> : null
  },
  methods: {
    clickCancelHandler () {
      console.log('Click Cancel')
    },
    clickOkHandler () {
      console.log('Click Ok')
    },
    onClose () {
      console.log('Click CERRAR')
      this.$emit('close-modal')
    }
  }
}

</script>

<style scoped>
.modall {
  min-width: 350px;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  z-index: 2000;
  position: absolute;
  background: white;
   @apply  rounded;
}
.modall > .modall-head {
  @apply relative;
}
 .modall-wrapper::after {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(37, 37, 37, 0.8);
}

</style>

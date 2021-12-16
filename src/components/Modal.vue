
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
            <button onClick={this.onClose} class='btn'>Cerrar</button>
            <a href="#" onClick={this.onClose}>
              <i class="material-icons modal-close-icon">Close</i>
            </a>
          </div>

          <div class="modall-content">
            {this.$slots.default}
            <button class='btn' onClick={this.clickCancelHandler}>Cancelar</button>
            <button class='btn' onClick={this.clickOkHandler}> OK </button>

          </div>

        </div>
      </div>
    </div> : null
  },
  methods: {
    clickCancelHandler () {
      this.$emit('close-modal')
    },
    clickOkHandler () {
      console.log('Click Ok')
    },
    onClose () {
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

.btn {
  border: none;
  background-color: #fff;
  cursor: pointer;

    /* border-radius: 4px; */
}
.btn:hover{
  box-shadow: 0px 3px 5px rgb(0,0,0,0.2);
}

</style>

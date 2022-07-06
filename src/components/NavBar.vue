<template>
  <vue-navigation-bar
    v-if="!pendingStudioModification"
    :options="navOptions"
    class="mr-0"
  >
    <template v-slot:custom-section>
      <div v-if="!administrationPanel" class="custom-section">
        <ul>
          <li>
            <a href="#" @click.prevent="download()">
              <i class="mdi mdi-export-variant"></i>
              <div>Export</div>
            </a>
            <token-loader :url="exportUrl" @finished="exportUrl = undefined">
            </token-loader>
          </li>
        </ul>
      </div>
    </template>
  </vue-navigation-bar>
</template>

<script>
import "bootstrap/dist/css/bootstrap.css";
import { mapGetters } from "vuex";
import TokenLoader from "./tools/TokenLoader";

export default {
  data() {
    return {
      exportUrl: undefined
    };
  },
  computed: {
    ...mapGetters("navigation", ["navSurveyOptions", "navAdminOptions"]),
    administrationPanel() {
      return this.$route.name.includes("Admin");
    },
    navOptions() {
      return this.navSurveyOptions;
    }
  },
  methods: {
    async download() {
      const baseUrl = `${process.env.VUE_APP_API_URL}/export/${this.currentSurvey.name}`;
      const sampleCode =
        this.currentUser?.sampleCodes.length == 1
          ? this.currentUser?.sampleCodes[0]
          : this.$route.query?.["@SAMPLE"];
      this.exportUrl = sampleCode ? `${baseUrl}/${sampleCode}` : baseUrl;
    }
  },
  components: {
    TokenLoader
  }
};
</script>

<style lang="scss">
.vnb__menu-options--left {
  margin-right: 1em;
}

.custom-section ul {
  margin-bottom: 0;
  padding-left: 0;
}

.custom-section i {
  margin-right: 5px;
}

.custom-section a {
  color: #000 !important;
  display: flex;
  font-weight: 500;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  transition: color 0.2s ease-in;

  &:hover {
    color: #0081ff !important;
  }
}

.custom-section li {
  list-style-type: none;
  text-decoration: none;
}

.vnb {
  &__menu-options {
    &__option {
      &__link {
        color: #000 !important;
        &:focus {
          outline: none;
          border: 1px solid none;
        }
        &:hover {
          color: #0081ff !important;
          .vnb__menu-options__option__arrow {
            fill: #0081ff;
          }
        }
        &__icon {
          svg {
            fill: #0081ff !important;
          }
        }
      }
    }
  }

  &__sub-menu-options {
    &__option {
      &__link {
        &:focus {
          outline: none;
          border: 1px solid none;
        }
        color: rgba(0, 0, 0, 0.562) !important;
        &:hover {
          color: #0081ff !important;
        }
      }
    }
  }
}

.vnb__popup {
  max-height: 80vh;
  overflow-x: hidden;
  overflow-y: scroll !important;
  .vnb__popup__top__close-button {
    &:focus {
      border: 1px solid none;
      outline: none;
    }
    top: 20px;
    right: -33px;
    svg {
      fill: #000 !important;
    }
  }
}

.vnb__popup__bottom__custom-section ul {
  list-style-type: none;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  margin-top: 0;
  margin-bottom: 0;
  padding-left: 0;
  color: #0081ff !important;
}

.vnb__popup__bottom__custom-section a {
  padding: 12px 24px;
  color: #0081ff !important;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  transition: color 0.2s ease-in, background 0.2s ease-in, border 0.2s ease-in;
  border-left: 2px solid #fff;
  width: 100%;

  svg {
    fill: #0081ff !important;
  }

  &:hover {
    color: #333 !important;
    text-decoration: none;
    background: #f3f3f3;
    border-left: 2px solid #007aff;
  }
}
</style>

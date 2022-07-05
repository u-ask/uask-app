<template>
  <div class="pageSetsInfo">
    <v-row>
      <v-col cols="12" md="4">
        <router-link :to="getInterviewsByStatus('none')">
          <figure-card
            variant="danger"
            :legend="$t('noInterviewCount')"
            :figure="noInterviewCount"
            :nbParticipant="this.figures.participantCount"
            class="noInterview"
          >
          </figure-card>
        </router-link>
      </v-col>
      <v-col cols="12" md="4">
        <router-link
          :to="getInterviewsByStatus(['incomplete', 'insufficient'])"
        >
          <figure-card
            variant="warning"
            :legend="$t('incompleteInterviewCount')"
            :figure="incompleteInterviewCount"
            :nbParticipant="this.figures.participantCount"
            class="incompleteInterview"
          >
          </figure-card>
        </router-link>
      </v-col>
      <v-col cols="12" md="4">
        <router-link :to="getInterviewsByStatus('fulfilled')">
          <figure-card
            variant="success"
            :legend="$t('completedInterviewCount')"
            :figure="completedInterviewCount"
            :nbParticipant="this.figures.participantCount"
            class="completedInterview"
          >
          </figure-card>
        </router-link>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import FigureCard from "./FigureCard";

export default {
  data() {
    return {
      figures: {}
    };
  },
  computed: {
    completedInterviewCount() {
      return this.figures.completedInterviewCount ?? 0;
    },
    incompleteInterviewCount() {
      return this.figures.incompleteInterviewCount ?? 0;
    },
    noInterviewCount() {
      return this.figures?.participantCount - this.figures?.interviewCount ?? 0;
    }
  },
  methods: {
    getInterviewsByStatus(status) {
      return {
        name: "Search participant",
        query: { interviewStatus: status }
      };
    }
  },
  async mounted() {
    const sample =
      this.currentUser.samples.length == 1
        ? this.currentUser.samples[0]
        : undefined;
    this.figures = await this.drivers.summaryDriver
      .getFigures(this.currentSurvey, sample)
      .catch(() => {
        return {
          completedInterviewCount: 0,
          incompleteInterviewCount: 0,
          interviewCount: 0,
          participantCount: 0
        };
      });
  },
  components: {
    FigureCard
  },
  i18n: {
    messages: {
      en: {
        title: "Interview informations",
        noInterviewCount: "Participants with no interview",
        completedInterviewCount: "Participants with all interviews completed",
        incompleteInterviewCount: "Participants with incomplete interviews"
      },
      fr: {
        title: "Informations sur les interviews",
        noInterviewCount: "Participants sans interviews",
        completedInterviewCount: "Participants avec toutes les interviews complètes",
        incompleteInterviewCount: "Participants avec interviews incomplètes"
      }
    }
  }
};
</script>

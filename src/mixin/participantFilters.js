import { formatCode } from "uask-dom";

export class ParticipantFilters {
  constructor(survey, variableNames = undefined) {
    this.survey = survey;

    this._fixedFilters = {
      "@SAMPLE": this.idSample.bind(this),
      idParticipant: this.idParticipant.bind(this),
      includedOnly: this.includedOnly.bind(this),
      interviewStatus: this.interviewStatus.bind(this)
    };

    this._customFilters = {
      ...variableNames?.reduce((res, v) => {
        res[v] = this.getFilterForVariable(v);
        return res;
      }, {})
    };

    this._allFilters = {
      ...this._fixedFilters,
      ...this._customFilters
    };
  }

  idSample(sampleCode) {
    return participant => participant.sampleCode == sampleCode;
  }

  idParticipant(participantCode) {
    return participant =>
      formatCode(participant, this.survey.options) ==
      formatCode({ participantCode }, this.survey.options);
  }

  includedOnly(value) {
    return participant => (value ? participant.included : true);
  }

  interviewStatus(status) {
    return participant =>
      status.some(s => participant.currentInterview?.status == s);
  }

  getFilterForVariable(variableName) {
    return value => participant =>
      this.applyCustom(variableName, value)(participant);
  }

  applyCustom(variableName, value) {
    const type = this.survey.pins.find(pin => pin.variableName == variableName)
      .type;
    if (value === "undefined") value = undefined;
    return participant => {
      const valueForParticipant = participant.pins[variableName]?.value;
      return type.name == "date"
        ? compareDate(value, valueForParticipant)
        : valueForParticipant == value;
    };
  }

  apply(query) {
    return participant => {
      for (const q in query)
        if (!this.applyIfFiltered(participant, query, q)) return false;
      return true;
    };
  }

  applyIfFiltered(participant, query, q) {
    return (
      !this.isFiltered(query, q) || this.applyFilter(participant, query, q)
    );
  }

  applyFilter(participant, query, q) {
    const f = this._allFilters[q](query[q]);
    return f(participant);
  }

  isFiltered(query, q) {
    return (
      (!Array.isArray(query[q]) && typeof query[q] != "undefined") ||
      (Array.isArray(query[q]) && query[q].length > 0)
    );
  }
}

export function compareDate(expected, date) {
  date = convertDateTimeToDate(date);
  if (typeof expected == "object") return isDateInInterval(expected, date);
  if (typeof expected === "undefined") return date === undefined;
  return isDateEqualsExpected(expected, date);
}

function isDateInInterval(expected, date) {
  expected.start = convertDateTimeToDate(expected.start);
  expected.end = convertDateTimeToDate(expected.end);
  const isBeforeEnd =
    expected.end == undefined
      ? true
      : date?.getTime() <= expected.end?.getTime();
  const isAfterStart =
    expected.start == undefined
      ? true
      : date?.getTime() >= expected.start?.getTime();
  return isBeforeEnd && isAfterStart;
}

function isDateEqualsExpected(expected, date) {
  const start = convertDateTimeToDate(expected);
  const end =
    expected.length == 4
      ? getLastDayOfTheYear(start)
      : expected.length == 7
      ? getLastDayOfTheMonth(start)
      : start;

  return isDateInInterval({ start, end }, date);
}

function convertDateTimeToDate(date) {
  const value = new Date(date);
  return date
    ? new Date(Math.round(value.getTime() / 86400000) * 86400000)
    : undefined;
}

function getLastDayOfTheMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function getLastDayOfTheYear(date) {
  return new Date(date.getFullYear(), 11, 31);
}

export default {
  computed: {
    participantFilters() {
      const variableNames = this.currentSurvey.pins.map(
        pin => pin.variableName
      );
      return new ParticipantFilters(this.currentSurvey, variableNames);
    }
  }
};

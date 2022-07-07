import { Participant, Sample } from "uask-dom";
import test from "tape";
import { buildDriver } from "../store/drivers4test.js";
import { ParticipantFilters, compareDate } from "./participantFilters.js";

const drivers = buildDriver();

async function seed() {
  const survey = await drivers.surveyDriver.getByName("P11-05");
  const samples = await drivers.sampleDriver.getBySampleCode(survey, "001");
  const participants = await drivers.summaryDriver.getAll(
    survey,
    samples,
    [
      "participantCode",
      "sampleCode",
      "currentInterview",
      "interviewCount",
      "pins",
      "included"
    ],
    { limit: 5 }
  );
  const filters = new ParticipantFilters(survey, samples, ["COU", "SMOWHEN"]);
  return { survey, filters, participants };
}

test("Filter participants by sampleCode", async t => {
  const { filters, participants } = await seed();
  const participant = new Participant("003", new Sample("002"));
  const filter = filters.apply({ "@SAMPLE": "001" });
  t.ok(filter(participants[0]));
  t.notOk(filter(participant));
  t.end();
});

test("Filter participants by participantCode", async t => {
  const { filters, participants } = await seed();
  const filter = filters.apply({ "@SAMPLE": "001", idParticipant: "000003" });
  t.notOk(filter(participants[0]));
  t.notOk(filter(participants[1]));
  t.ok(filter(participants[2]));
  t.end();
});

test("Filter participants by inclusion for a survey without included participants", async t => {
  const survey = await drivers.surveyDriver.getByName("P11-05");
  const samples = [new Sample("001"), new Sample("002")];
  const participants = [
    new Participant("001", samples[0]),
    new Participant("001", samples[1]),
    new Participant("003", samples[0])
  ];
  const filters = new ParticipantFilters(survey, samples);
  let filter = filters.apply({ includedOnly: true });
  t.notOk(filter(participants[0]));
  filter = filters.apply({ includedOnly: undefined });
  t.ok(filter(participants[0]));
  t.end();
});

test("Filter participants by inclusion for a survey with included participants", async t => {
  const { filters, participants } = await seed();
  const filter = filters.apply({ includedOnly: true });
  t.ok(filter(participants[0]));
  t.ok(filter(participants[1]));
  t.end();
});

test("Filter participants by interviewStatus", async t => {
  const { filters, participants } = await seed();
  let filter = filters.apply({
    interviewStatus: ["fulfilled"]
  });
  t.notOk(filter(participants[0]));
  t.ok(filter(participants[1]));
  filter = filters.apply({
    interviewStatus: ["fulfilled", "incomplete"]
  });
  t.ok(filter(participants[0]));
  t.ok(filter(participants[1]));
  t.end();
});

test("Filter participants with customized filter", async t => {
  const { filters, participants } = await seed();

  let filterFRA = filters.apply({ COU: "FRA" });
  const countryFRA = participants.filter(p => filterFRA(p));
  t.ok(countryFRA.every(p => p.pins["COU"].value == "FRA"));
  t.end();
});

test("Filter participants with multiple criterias in customized filter", async t => {
  const { filters, participants } = await seed();

  let filter = filters.apply({ COU: "FRA", SMOWHEN: "2007" });
  const participantfiltered = participants.filter(p => filter(p));
  t.ok(
    participantfiltered.every(
      p =>
        p.pins["COU"].value == "FRA" &&
        p.pins["SMOWHEN"].value.substring(0, 4) == "2007"
    )
  );
  t.end();
});

test("Filter participants with date criterias in customized filter", async t => {
  const { filters, participants } = await seed();
  const filter = filters.apply({ SMOWHEN: { start: "2007", end: "2007-09" } });
  const participantfiltered = participants.filter(p => filter(p));
  t.ok(
    participantfiltered.every(p => {
      const value = new Date(p.pins["SMOWHEN"].value);
      return value >= new Date("2007-01-01") && value <= new Date("2007-09-01");
    })
  );
  t.end();
});

test("Filter participants by undefined criteria in fixed filter", async t => {
  const { filters, participants } = await seed();
  const filter = filters.apply({ "@SAMPLE": undefined });
  t.ok(filter(participants[0]));
  t.ok(filter(participants[1]));
  t.end();
});

test("CompareDate returns true if complete date between two dates #199 ", t => {
  const date = new Date("2020-06-06");
  const expected = {
    start: "2020-01-01",
    end: "2020-12-12"
  };

  t.true(compareDate(expected, date));
  t.end();
});

test("CompareDate returns false if complete date not between two dates #199 ", t => {
  const dateBefore = new Date("2019-06-06");
  const expected = {
    start: "2020-01-01",
    end: "2020-12-12"
  };

  t.false(compareDate(expected, dateBefore));
  const dateAfter = new Date("2021-06-06");
  t.false(compareDate(expected, dateAfter));
  t.end();
});

test("CompareDate (complete) if only start date is completed #199 ", t => {
  const date = new Date("2020-06-06");
  const dateBefore = new Date("2019-06-06");
  const expected = {
    start: "2020-01-01",
    end: undefined
  };

  t.true(compareDate(expected, date));
  t.false(compareDate(expected, dateBefore));
  t.end();
});

test("CompareDate (complete) if only end date is completed #199 ", t => {
  const date = new Date("2020-06-06");
  const dateAfter = new Date("2032-06-06");
  const expected = {
    start: undefined,
    end: "2021-06-06"
  };

  t.true(compareDate(expected, date));
  t.false(compareDate(expected, dateAfter));
  t.end();
});

test("CompareDate returns true if incomplete date between two incomplete dates #199 ", t => {
  const date = "2020-06-06";
  const expected = {
    start: "2020-01-01",
    end: "2020-12-12"
  };

  t.true(compareDate(expected, date));
  t.end();
});

test("CompareDate returns false if incomplete date not between two incomplete dates #199 ", t => {
  const dateBefore = "2019-06-06";
  const expected = {
    start: "2020-01-01",
    end: "2020-12-12"
  };

  t.false(compareDate(expected, dateBefore));
  const dateAfter = "2021-06-06";
  t.false(compareDate(expected, dateAfter));
  t.end();
});

test("CompareDate returns true if incomplete date not between two incomplete dates #199 ", t => {
  const dateBefore = "2019-06-06";
  const expected = {
    start: "2020-01-01",
    end: "2020-12-12"
  };

  t.false(compareDate(expected, dateBefore));
  const dateAfter = "2021-06-06";
  t.false(compareDate(expected, dateAfter));
  t.end();
});

test("CompareDate (incomplete) if only start date is completed #199 ", t => {
  const date = "2020-06-06";
  const dateBefore = "2019-06-06";
  const expected = {
    start: "2020-01-01",
    end: undefined
  };

  t.true(compareDate(expected, date));
  t.false(compareDate(expected, dateBefore));
  t.end();
});

test("CompareDate (incomplete) if only end date is completed #199 ", t => {
  const date = "2020-06-06";
  const dateAfter = "2032-06-06";
  const expected = {
    start: undefined,
    end: "2021-06-06"
  };

  t.true(compareDate(expected, date));
  t.false(compareDate(expected, dateAfter));
  t.end();
});

test("CompareDate complete an incomplete date with the first if the day/month is empty #199 ", t => {
  const date = "2021-06";
  const dateBefore = "2019";
  const dateAfter = "2032-06-06";

  const expected = {
    start: "2020-01",
    end: "2025-12"
  };

  t.true(compareDate(expected, date));
  t.false(compareDate(expected, dateBefore));
  t.false(compareDate(expected, dateAfter));
  t.end();
});

test("CompareDate with an incomplete date undefined should returns false #199 ", t => {
  const date = undefined;

  const expected = {
    start: "2020-01",
    end: "2025-12"
  };

  t.false(compareDate(expected, date));
  t.end();
});

test("CompareDate with two incomplete dates #199 ", t => {
  const date = "2020-02-03";
  const expected = "2020-02-03";

  t.true(compareDate(expected, date));
  t.end();
});

test("CompareDate with two complete dates #199 ", t => {
  const date = new Date("2020-02-03");
  const expected = new Date("2020-02-03");

  t.true(compareDate(expected, date));
  t.end();
});

test("CompareDate comparison with an incomplete date and undefined  #199 ", t => {
  const date = undefined;
  const expected = "2020-02-03";

  t.false(compareDate(expected, date));
  t.end();
});

test("CompareDate comparison with an incomplete date and undefined  #199 ", t => {
  const date = undefined;
  const expected = "2020-02-03";
  const expectedU = undefined;

  t.false(compareDate(expected, date));
  t.true(compareDate(expectedU, date));
  t.end();
});

test("Compare two dates should handle timzone #291", t => {
  const date = "2021-04-02T22:00:00.000Z";
  const expected = {
    start: "2021-04-03",
    end: undefined
  };
  t.true(compareDate(expected, date));
  t.end();
});

test("Compare a date with a precise incomplete date #291", t => {
  t.true(compareDate("2021", new Date("2021-06-06")));
  t.false(compareDate("2021", new Date("2022-06-06")));
  t.true(compareDate("2021-03", new Date("2021-03-25")));
  t.true(compareDate("2021-03", new Date("2021-03-01")));
  t.false(compareDate("2021-03", new Date("2021-04-06")));
  t.end();
});

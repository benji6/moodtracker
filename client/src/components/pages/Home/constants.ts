import { ComponentProps } from "react";
import MoodByHourChart from "../../shared/MoodByHourChart";
import MoodByLocationTable from "../../shared/MoodByLocationTable";
import MoodByTemperatureChart from "../../shared/MoodByTemperatureChart";
import MoodByWeatherChart from "../../shared/MoodByWeatherChart";
import MoodByWeekdayChart from "../../shared/MoodByWeekdayChart";

export const LINE_CHART_PROPS: {
  data: [number, number][];
  domain: [number, number];
  trendlinePoints: [number, number][];
  xLabels: string[];
} = {
  data: [
    [1603667889807, 6],
    [1603671665641, 5],
    [1603699254071, 4],
    [1603704446665, 6],
    [1603708885713, 7],
    [1603718504147, 7],
    [1603734892787, 7],
    [1603743736493, 8],
    [1603749048034, 7],
    [1603786974015, 5],
    [1603792744002, 6],
    [1603793556929, 6],
    [1603802435604, 7],
    [1603810577119, 6],
    [1603814989164, 4],
    [1603834676926, 7],
    [1603841560793, 7],
    [1603875271570, 6],
    [1603882283133, 7],
    [1603887384681, 7],
    [1603890707987, 7],
    [1603917918279, 7],
    [1603920984728, 7],
    [1603924287954, 7],
    [1603963452036, 7],
    [1603983396198, 7],
    [1603990267550, 8],
    [1603995030623, 8],
    [1603999289565, 5],
    [1604000940301, 6],
    [1604002516229, 6],
    [1604058266660, 7],
    [1604060117816, 7],
    [1604064555131, 7],
    [1604067333501, 7],
    [1604068027309, 7],
    [1604071477486, 7],
    [1604075416890, 7],
    [1604079208680, 8],
    [1604086223061, 8],
    [1604087619651, 8],
    [1604097624205, 8],
    [1604100467736, 8],
    [1604102614909, 8],
    [1604135710129, 8],
    [1604138585881, 8],
    [1604140548633, 8],
    [1604142320115, 8],
    [1604161862539, 9],
    [1604168677188, 8],
    [1604174501316, 8],
    [1604182751770, 8],
    [1604189376701, 8],
    [1604225839595, 8],
    [1604232375778, 8],
    [1604238907342, 7],
    [1604244830856, 7],
    [1604249364806, 7],
    [1604253257747, 8],
    [1604256749442, 8],
    [1604274382661, 7],
    [1604274912955, 8],
    [1604301793890, 7],
  ],
  domain: [1603670400000, 1604275200000],
  trendlinePoints: [
    [1603670400000, 4.63],
    [1603689300000, 5.24],
    [1603708200000, 5.87],
    [1603727100000, 6.85],
    [1603746000000, 6.82],
    [1603764900000, 6.29],
    [1603783800000, 5.99],
    [1603802700000, 5.65],
    [1603821600000, 6.14],
    [1603840500000, 6.16],
    [1603859400000, 6.62],
    [1603878300000, 6.65],
    [1603897200000, 6.83],
    [1603916100000, 7],
    [1603935000000, 7],
    [1603953900000, 7],
    [1603972800000, 7.05],
    [1603991700000, 6.77],
    [1604010600000, 6.6],
    [1604029500000, 6.48],
    [1604048400000, 6.77],
    [1604067300000, 7.26],
    [1604086200000, 7.65],
    [1604105100000, 7.98],
    [1604124000000, 8.04],
    [1604142900000, 8.23],
    [1604161800000, 8.23],
    [1604180700000, 8.18],
    [1604199600000, 8],
    [1604218500000, 7.8],
    [1604237400000, 7.68],
    [1604256300000, 7.53],
    [1604275200000, 7.5],
  ],
  xLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
};

export const MOOD_BY_HOUR_PROPS: ComponentProps<typeof MoodByHourChart> = {
  data: [
    [0, 7.43],
    [1, 7.39],
    [2, 7.36],
    [3, 7.32],
    [4, 7.29],
    [5, 7.25],
    [6, 7.21],
    [7, 7],
    [8, 7.11],
    [9, 7.22],
    [10, 7.23],
    [11, 7.23],
    [12, 7.17],
    [13, 7],
    [14, 6.3],
    [15, 6],
    [16, 6.1],
    [17, 6.2],
    [18, 6.3],
    [19, 6.8],
    [20, 7.3],
    [21, 7.46],
    [22, 7.5],
    [23, 7.47],
  ],
};

export const MOOD_BY_LOCATION_PROPS: ComponentProps<
  typeof MoodByLocationTable
> = {
  moodsByLocation: {
    "New York City": [1, 10, 6],
    London: [7, 7, 7, 8, 9],
    Paris: [5, 4, 6, 7, 6, 8],
    Tokyo: [8, 5, 6, 7, 7],
    Dubai: [6, 7, 8, 5, 6],
  },
};

export const MOOD_BY_TEMPERATURE_PROPS: ComponentProps<
  typeof MoodByTemperatureChart
> = {
  coarseGrainedData: [
    [-5, 8],
    [-3, 6.1],
    [-2, 7],
    [-1, 6.888888888888889],
    [0, 6.958333333333333],
    [1, 6],
    [2, 5.5],
    [3, 5.571428571428571],
    [4, 4.8],
    [5, 5.571428571428571],
    [6, 6.545454545454546],
    [7, 5.909090909090909],
    [8, 7.333333333333333],
    [9, 7],
    [10, 7.857142857142857],
    [11, 8.076923076923077],
    [12, 7.5],
    [15, 8],
  ],
  fineGrainedData: [
    [-5.399999999999977, 8],
    [-3.25, 6],
    [-2.5399999999999636, 6],
    [-2.169999999999959, 7],
    [-1.8999999999999773, 7],
    [-1.25, 8],
    [-1.1399999999999864, 8],
    [-1.1299999999999955, 7],
    [-1.1099999999999568, 7],
    [-1.099999999999966, 7],
    [-1.009999999999991, 7.5],
    [-0.9799999999999613, 7],
    [-0.9599999999999795, 7],
    [-0.7799999999999727, 7],
    [-0.7599999999999909, 7],
    [-0.6499999999999773, 7],
    [-0.6299999999999955, 7],
    [-0.6099999999999568, 4],
    [-0.589999999999975, 6],
    [-0.5600000000000023, 6],
    [-0.5499999999999545, 7],
    [-0.48999999999995225, 7],
    [-0.46999999999997044, 8],
    [-0.44999999999998863, 7],
    [-0.3299999999999841, 7],
    [-0.2899999999999636, 7],
    [-0.14999999999997726, 7],
    [-0.07999999999998408, 5],
    [0.05000000000001137, 8],
    [0.08000000000004093, 6],
    [0.12999999999999545, 8],
    [0.1400000000000432, 7],
    [0.17000000000001592, 7],
    [0.2300000000000182, 7],
    [0.32000000000005, 6.5],
    [0.37000000000000455, 7],
    [0.37999999999999545, 7],
    [0.4200000000000159, 8],
    [0.4300000000000068, 8],
    [0.4700000000000273, 6],
    [0.4900000000000091, 7],
    [0.8500000000000227, 6],
    [1, 6],
    [1.740000000000009, 7],
    [1.7900000000000205, 6],
    [2.590000000000032, 2],
    [2.7200000000000273, 7],
    [2.890000000000043, 6],
    [2.9399999999999977, 7],
    [3.230000000000018, 7],
    [3.390000000000043, 3],
    [3.420000000000016, 4],
    [3.5100000000000477, 2],
    [3.7000000000000455, 6],
    [4, 4],
    [4.220000000000027, 4],
    [4.260000000000048, 7],
    [4.670000000000016, 6],
    [4.730000000000018, 6],
    [4.75, 7],
    [4.770000000000039, 7],
    [4.830000000000041, 6],
    [5, 6],
    [5.060000000000002, 5],
    [5.1200000000000045, 5],
    [5.2000000000000455, 7],
    [5.32000000000005, 6],
    [5.350000000000023, 5],
    [5.360000000000014, 6],
    [5.3700000000000045, 3],
    [5.470000000000027, 2],
    [5.53000000000003, 5.5],
    [5.6299999999999955, 8],
    [5.760000000000048, 7],
    [5.78000000000003, 6],
    [5.830000000000041, 6],
    [5.860000000000014, 8],
    [5.939999999999998, 5],
    [6.160000000000025, 8],
    [6.390000000000043, 6],
    [6.480000000000018, 7],
    [6.53000000000003, 4],
    [6.560000000000002, 7],
    [6.640000000000043, 6],
    [6.689999999999998, 8],
    [6.740000000000009, 7],
    [6.7900000000000205, 7],
    [6.800000000000011, 6],
    [6.960000000000036, 3],
    [6.980000000000018, 5],
    [7.010000000000048, 4],
    [7.180000000000007, 8],
    [7.850000000000023, 6],
    [8.189999999999998, 8],
    [8.270000000000039, 8],
    [8.510000000000048, 8],
    [8.629999999999995, 5],
    [8.870000000000005, 8],
    [9.410000000000025, 7],
    [9.710000000000036, 8],
    [9.720000000000027, 8],
    [9.810000000000002, 8],
    [10.07000000000005, 8],
    [10.28000000000003, 8],
    [10.32000000000005, 7],
    [10.439999999999998, 8],
    [10.53000000000003, 8],
    [10.580000000000041, 9],
    [10.670000000000016, 9],
    [10.689999999999998, 8],
    [10.710000000000036, 7],
    [10.800000000000011, 9],
    [10.930000000000007, 9],
    [10.950000000000045, 8],
    [10.970000000000027, 8],
    [11, 8],
    [11.020000000000039, 7.5],
    [11.080000000000041, 7],
    [11.510000000000048, 7],
    [11.770000000000039, 7],
    [11.830000000000041, 8],
    [11.879999999999995, 8],
    [12.129999999999995, 8],
    [12.330000000000041, 7.5],
    [12.400000000000034, 7],
    [14.53000000000003, 8],
  ],
};

export const MOOD_BY_WEATHER_PROPS: ComponentProps<typeof MoodByWeatherChart> =
  {
    data: [
      {
        iconName: "sun",
        key: "Clear:sun:orange",
        moodColor: "rgb(0, 242, 186)",
        title: "Clear (average of 32 moods): 8.3",
        labelText: "Clear",
        weatherColor: "orange",
        y: 8.3,
      },
      {
        iconName: "partly-cloudy-day",
        key: "Partly cloudy:partly-cloudy-day:orange",
        moodColor: "rgb(0, 240, 191)",
        title: "Partly cloudy (average of 29 moods): 7.9",
        labelText: "Partly cloudy",
        weatherColor: "orange",
        y: 7.9,
      },
      {
        iconName: "snow",
        key: "Snow:snow:var(--color-balance)",
        moodColor: "rgb(0, 242, 186)",
        title: "Snow (average of 3 moods): 7.5",
        labelText: "Snow",
        weatherColor: "var(--color-balance)",
        y: 7.5,
      },
      {
        iconName: "rain",
        key: "Rain:rain:#30f",
        moodColor: "rgb(0, 246, 166)",
        title: "Rain (average of 12 moods): 7.4",
        labelText: "Rain",
        weatherColor: "#30f",
        y: 7.4,
      },
      {
        iconName: "drizzle",
        key: "Drizzle:drizzle:steelblue",
        moodColor: "rgb(0, 244, 176)",
        title: "Drizzle (average of 3 moods): 6.9",
        labelText: "Drizzle",
        weatherColor: "steelblue",
        y: 6.9,
      },
      {
        iconName: "cloud",
        key: "Clouds:cloud:var(--color-balance)",
        moodColor: "rgb(0, 239, 197)",
        title: "Clouds (average of 43 moods): 6.3",
        labelText: "Clouds",
        weatherColor: "var(--color-balance)",
        y: 6.3,
      },
      {
        iconName: "fog",
        key: "Fog/Haze/Dust:fog:var(--color-balance)",
        moodColor: "rgb(0, 239, 197)",
        title: "Fog/Haze/Dust (average of 19 moods): 6.2",
        labelText: "Fog/Haze/Dust",
        weatherColor: "var(--color-balance)",
        y: 6.2,
      },
    ],
  };

export const MOOD_BY_WEEKDAY_PROPS: ComponentProps<typeof MoodByWeekdayChart> =
  {
    averages: [
      ["Mon", 4.82],
      ["Tue", 5.51],
      ["Wed", 5.08],
      ["Thu", 6.73],
      ["Fri", 8.01],
      ["Sat", 8.17],
      ["Sun", 7.44],
    ],
  };

export const MOOD_FREQUENCY_PROPS = {
  data: [0, 0, 0, 0, 1, 4, 9, 18, 7, 1, 0],
};

export const SUMMARY_PROPS = {
  currentPeriod: {
    best: 9,
    mean: 7.8,
    meanSleep: 490,
    runMeters: 5000,
    runSeconds: 1500,
    secondsMeditated: 1800,
    standardDeviation: 0.52,
    total: 31,
    totalLegRaises: 20,
    totalPushUps: 50,
    totalSitUps: 60,
    worst: 6,
  },
  previousPeriod: {
    best: 8,
    mean: 6.1,
    meanSleep: 450,
    runMeters: 5000,
    runSeconds: 1560,
    secondsMeditated: 600,
    standardDeviation: 1.02,
    total: 31,
    totalLegRaises: 30,
    totalPushUps: 40,
    totalSitUps: 35,
    worst: 4,
  },
  periodType: "week" as const,
};

export const WORD_CLOUD_PROPS = {
  "😄": 2,
  "😊": 4,
  "😌": 3,
  "😔": 2,
  "😖": 2,
  "😡": 1,
  "🙂": 3,
  Afraid: 1,
  Agitated: 2,
  Amused: 2,
  Angry: 1,
  Annoyed: 1,
  Anxious: 2,
  Awe: 1,
  Busy: 2,
  Buzzing: 1,
  Calm: 3,
  Cathartic: 2,
  Compassionate: 1,
  Confused: 1,
  Connected: 3,
  Content: 1,
  Disappointed: 1,
  Doubtful: 1,
  Emotional: 1,
  Empty: 2,
  Energetic: 3,
  Excited: 5,
  Exhausted: 2,
  Expansive: 3,
  Free: 2,
  Fulfilled: 2,
  Gloomy: 4,
  Good: 4,
  Great: 3,
  Guilty: 1,
  Happy: 8,
  Healthy: 1,
  Hopeless: 1,
  Joyful: 5,
  Lonely: 1,
  Loss: 1,
  Lost: 1,
  Loving: 1,
  Merry: 1,
  Nervous: 1,
  Nostalgic: 1,
  Offended: 1,
  Open: 1,
  Peaceful: 1,
  Positive: 6,
  Proud: 1,
  Reflective: 2,
  Relaxed: 1,
  Relieved: 1,
  Restless: 1,
  Sad: 1,
  Satisfied: 1,
  Sentimental: 1,
  Sleepy: 1,
  Spacious: 1,
  Stressed: 2,
  Tense: 1,
  Tired: 3,
  Troubled: 1,
  Unhappy: 1,
  Unsure: 1,
  Upbeat: 1,
  Worried: 3,
  "Wound-up": 1,
};

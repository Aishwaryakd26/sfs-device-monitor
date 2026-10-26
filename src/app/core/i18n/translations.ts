export type SupportedLanguage = 'en' | 'de';

export interface TranslationDictionary {
  appTitle: string;
  selectMachine: string;
  chooseDevice: string;
  activeMachine: string;
  statusRunning: string;
  statusStopped: string;
  statusMaintenance: string;
  hintStoppedTitle: string;
  hintStoppedDesc: string;
  hintMaintenanceTitle: string;
  hintMaintenanceDesc: string;
  historicPpm: string;
  historicProduced: string;
  ppmUnit: string;
  unitsUnit: string;
  orderProgress: string;
  orderPrefix: string;
  targetUnits: string;
  producedSoFar: string;
  remaining: string;
  completed: string;
  interruptsTitle: string;
  incidentSingle: string;
  incidentPlural: string;
  stoppedIncident: string;
  maintenanceIncident: string;
  noInterrupts: string;
  coreApiLive: string;
  awaitingStream: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appTitle: 'SFS Device Performance Monitor',
    selectMachine: 'Select Production Machine:',
    chooseDevice: '-- Choose a Device --',
    activeMachine: 'Active Machine',
    statusRunning: 'Running',
    statusStopped: 'Stopped',
    statusMaintenance: 'Maintenance',
    hintStoppedTitle: 'Machine Halted:',
    hintStoppedDesc: 'Production stopped abruptly. Inspect machine sensor inputs and resolve interrupt log.',
    hintMaintenanceTitle: 'Scheduled Maintenance in Progress:',
    hintMaintenanceDesc: 'Machine undergoing calibration or servicing. Metric collection is suspended.',
    historicPpm: 'Historic Parts Per Minute',
    historicProduced: 'Historic Parts Produced (Current Session)',
    ppmUnit: 'ppm',
    unitsUnit: 'units',
    orderProgress: 'Order Production Progress',
    orderPrefix: 'Order #',
    targetUnits: 'Target Units:',
    producedSoFar: 'Produced So Far:',
    remaining: 'Remaining:',
    completed: 'COMPLETED',
    interruptsTitle: 'Production Interrupts',
    incidentSingle: 'Incident',
    incidentPlural: 'Incidents',
    stoppedIncident: 'Machine Emergency / Stopped State',
    maintenanceIncident: 'Machine Maintenance Intervention',
    noInterrupts: 'No interrupts detected for the selected machine session.',
    coreApiLive: 'Core API Live',
    awaitingStream: 'Awaiting device telemetry stream...'
  },
  de: {
    appTitle: 'SFS Anlagen-Leistungsüberwachung',
    selectMachine: 'Produktionsmaschine auswählen:',
    chooseDevice: '-- Maschine auswählen --',
    activeMachine: 'Aktive Maschine',
    statusRunning: 'In Betrieb',
    statusStopped: 'Gestoppt',
    statusMaintenance: 'Wartung',
    hintStoppedTitle: 'Maschine angehalten:',
    hintStoppedDesc: 'Produktion abrupt unterbrochen. Bitte Sensoreingaben und Störungsprotokoll prüfen.',
    hintMaintenanceTitle: 'Geplante Wartung aktiv:',
    hintMaintenanceDesc: 'Maschine wird kalibriert oder gewartet. Datenerfassung ist vorübergehend pausiert.',
    historicPpm: 'Historische Teile pro Minute',
    historicProduced: 'Produzierte Teile (Aktuelle Sitzung)',
    ppmUnit: 'Teile/Min',
    unitsUnit: 'Stück',
    orderProgress: 'Auftrags-Produktionsfortschritt',
    orderPrefix: 'Auftrag #',
    targetUnits: 'Soll-Menge:',
    producedSoFar: 'Bisher produziert:',
    remaining: 'Verbleibend:',
    completed: 'FERTIGGESTELLT',
    interruptsTitle: 'Produktionsunterbrechungen',
    incidentSingle: 'Vorgang',
    incidentPlural: 'Vorgänge',
    stoppedIncident: 'Maschinen-Notstopp / Stillstand',
    maintenanceIncident: 'Wartungseingriff an der Maschine',
    noInterrupts: 'Keine Unterbrechungen für die ausgewählte Maschinensitzung festgestellt.',
    coreApiLive: 'Kern-API Aktiv',
    awaitingStream: 'Warte auf Telemetriedaten...'
  }
};

export interface optionsType {
  label: string;
  value: string;
}

export interface rowEvent extends Event {
  active: boolean;
  id: string;
  name: string;
}

export class Geojson {
  properties: GeojsonProperties;
  geometry?: Geometry;
  geometries?: any;
  type: string;
}

export class GeojsonProperties {
  country?: string;
  identifier?: string;
  subregion?: string;
  count?: number;
  FID?: string | number;
}

export class Geometry {
  coordinates: any;
  type: string;
}

declare module "topojson-client" {
    import { GeoPermissibleObjects, FeatureCollection } from "geojson";
    export function feature<O extends GeoPermissibleObjects, D = any>(
      topology: O,
      object: any
    ): FeatureCollection<D, any>;
  }
  
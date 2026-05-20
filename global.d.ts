type NDEFRecordData = DataView | ArrayBuffer | null;

type NDEFRecord = {
  recordType: string;
  mediaType?: string;
  encoding?: string;
  data?: NDEFRecordData;
};

type NDEFReadingEvent = Event & {
  message: {
    records: NDEFRecord[];
  };
};

type NDEFWriteRecord = {
  recordType: "text" | "mime";
  mediaType?: string;
  data: string;
};

declare class NDEFReader extends EventTarget {
  scan(options?: { signal?: AbortSignal }): Promise<void>;
  write(message: string | { records: NDEFWriteRecord[] }): Promise<void>;
  onreading: ((event: NDEFReadingEvent) => void) | null;
  onreadingerror: (() => void) | null;
}

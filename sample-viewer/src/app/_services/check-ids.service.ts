// Regex functions to ensure that patient IDs look like patientIDs

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CheckIdsService {

  // Accepted regex patterns:
  accepted_patterns: RegExp[] = [
    // "G-1234".match(/^(G\-)(\d\d\d\d)$/)
    /^(G\-)(\d\d\d\d)$/,
    // "G-123".match(/^(G\-)(\d\d\d)$/)
    /^(G\-)(\d\d\d)$/,
    // "S-123".match(/^(S\-)(\d\d\d)$/)
    /^(S\-)(\d\d\d)$/,
    // "C-123-4".match(/^(C\-)(\d\d\d)\-(\d)$/)
    /^(C\-)(\d\d\d)\-(\d)$/
  ];

  // Things that are commonly seen and convertable to an acceptable pattern.
  doublecheckable_patterns: Object[] = [
    // --- G-numbers ---
    // "G1234".match(/^(G)(\d\d\d\d)$/)
    { pattern: /^(G)(\d\d\d\d)$/, message: "Adding hyphen", converter: this.addHyphen },
    // "G1234-7".match(/^(G)(\d\d\d\d)\-\d$/)
    { pattern: /^(G)(\d\d\d\d)\-\d$/, message: "Adding hyphen and removing visit code(?)", converter: this.addHyphen },
    // "G-1234-7".match(/^(G\-)(\d\d\d\d)\-\d$/)
    { pattern: /^(G\-)(\d\d\d\d)\-\d$/, message: "Removing visit code (?)", converter: this.removeVisitCode },
    // "G-123-7".match(/^(G\-)(\d\d\d)\-\d$/)
    { pattern: /^(G\-)(\d\d\d)\-\d$/, message: "Removing visit code (?)", converter: this.removeVisitCode },
    // "G123-7".match(/^(G)(\d\d\d)\-\d$/)
    { pattern: /^(G)(\d\d\d)\-\d$/, message: "Adding hyphen and removing visit code(?)", converter: this.addHyphen },
    // "G123".match(/^(G)(\d\d\d)$/)
    { pattern: /^(G)(\d\d\d)$/, message: "Adding hyphen", converter: this.addHyphen },

    // --- S-numbers ---
    // "S-1".match(/^(S-)(\d)$/)
    { pattern: /^(S-)(\d)$/, message: "Padding ID with 0s", converter: this.padZeros },
    // "S-12".match(/^(S-)(\d\d)$/)
    { pattern: /^(S-)(\d\d)$/, message: "Padding ID with 0s", converter: this.padZeros },
    // "S-0123".match(/^(S-)0(\d\d\d)$/)
    { pattern: /^(S-)0(\d\d\d)$/, message: "Removing extra leading 0 from start of ID", converter: this.removeZero },
    // "S1".match(/^(S)(\d)$/)
    { pattern: /^(S)(\d)$/, message: "Padding ID with 0s, adding hyphen", converter: this.addHyphen },
    // "S12".match(/^(S)(\d\d)$/)
    { pattern: /^(S)(\d\d)$/, message: "Padding ID with 0s, adding hyphen", converter: this.addHyphen },
    // "S123".match(/^(S)(\d\d\d)$/)
    { pattern: /^(S)(\d\d\d)$/, message: "Adding hyphen", converter: this.addHyphen },
    // "S0123".match(/^(S)0(\d\d\d)$/)
    { pattern: /^(S)0(\d\d\d)$/, message: "Removing first 0 from ID, adding hyphen", converter: this.addHyphen },
    // "S-12-7".match(/^(S-)(\d\d)\-\d$/)
    { pattern: /^(S-)(\d\d)\-\d$/, message: "Removing visit code (?), padding ID with 0s", converter: this.padZeros },
    // "S-123-7".match(/^(S-)(\d\d\d)\-\d$/)
    { pattern: /^(S-)(\d\d\d)\-\d$/, message: "Removing visit code (?)", converter: this.removeVisitCode },
    // "S12-7".match(/^(S)(\d\d)\-\d$/)
    { pattern: /^(S)(\d\d)\-\d$/, message: "Removing visit code (?), padding ID with 0s, adding hyphen", converter: this.padHyphenate },
    // "S123-7".match(/^(S)(\d\d\d)\-\d$/)
    { pattern: /^(S)(\d\d\d)\-\d$/, message: "Removing visit code (?), adding hyphen", converter: this.addHyphen },
    // "S7-12".match(/^(S)\d-(\d\d)$/)
    { pattern: /^(S)\d-(\d\d)$/, message: "Removing visit code (?), padding ID with 0s", converter: this.padHyphenate },
    // "S7-123".match(/^(S)\d-(\d\d\d)$/)
    { pattern: /^(S)\d-(\d\d\d)$/, message: "Removing visit code (?)", converter: this.padHyphenate },

    // --- C-numbers ---
    // "C7-123-4".match(/^(C)\d-(\d\d\d-\d)$/)
    { pattern: /^(C)\d-(\d\d\d-\d)$/, message: "Removing visit code (?)", converter: this.addHyphen },
  ]



  constructor() {
  }

  checkPatientID(id: string) {

    for (let pattern of this.accepted_patterns) {
      if (pattern.test(id)) {
        // Pattern checks out. One of the accepted ones.
        return ({ status: 200, id: id });
      }
    }

    let fixed_id: string;
    // Check if the ID is nearly what we expect it to be.
    for (let weirdpattern of this.doublecheckable_patterns) {
      let pattern_match = id.match(weirdpattern['pattern']);
      if (pattern_match) {
        // It's a little funky but fixable.
        fixed_id = weirdpattern['converter'](pattern_match);
        return ({ status: 302, id: fixed_id, message: weirdpattern['message'] })
      }
    }

    // Otherwise: return an error
    return ({ status: 400, id: null, message: "ID doesn't fit any of the expected patterns. Double check it's okay." })

  }



  // Functions to convert unacceptable but predictable IDs into acceptable ones.
  addHyphen(matchArr) {
    // combine the two pieces of the regex match, separated by a hyphen
    return (`${matchArr[1]}-${matchArr[2]}`)
  }

  removeVisitCode(matchArr) {
    // remove the visit code portion of the ID.
    return (`${matchArr[1]}${matchArr[2]}`)
  }

  removeZero(matchArr) {
    // remove the extra 0 from the ID
    return (`${matchArr[1]}${matchArr[2]}`)
  }

  padZeros(matchArr, n: number = 3) {
    return (`${matchArr[1]}${matchArr[2].padStart(n, '0')}`)
  }

  padHyphenate(matchArr, n: number = 3) {
    return (`${matchArr[1]}-${matchArr[2].padStart(n, '0')}`)
  }
}

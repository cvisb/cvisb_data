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
    /^(G\d\d)\-(\d{6})$/, // public

    // "S-123".match(/^(S\-)(\d\d\d)$/)
    /^(S\-)(\d\d\d)$/,
    /^(S\-)(\d{7})$/, // public
    // "C-123-4".match(/^(C\-)(\d\d\d)\-([1-4])$/)
    /^(C\-)(\d\d\d)\-([1-4])$/,
    /^(C\-)(\d{7})$/, // public
  ];

  // Things that are commonly seen and convertable to an acceptable pattern.
  doublecheckable_patterns: Object[] = [
    // --- G-numbers ---
    // "G1234".match(/^(G)(\d\d\d\d)$/)
    { pattern: /^(G)(\d\d\d\d)$/, message: "Adding hyphen", converter: this.padHyphenate, idxArr: null },

    // "G1234-7".match(/^(G)(\d\d\d\d)\-\d$/)
    { pattern: /^(G)(\d\d\d\d)\-(\d)$/, message: "Adding hyphen and removing visit code(?)", converter: this.removeVisitCode, idxArr: [1, 2, 3] },

    // "G-1234-7".match(/^(G\-)(\d\d\d\d)\-\d$/)
    { pattern: /^(G)\-(\d\d\d\d)\-(\d)$/, message: "Removing visit code (?)", converter: this.removeVisitCode, idxArr: [1, 2, 3] },

    // "G-123-7".match(/^(G\-)(\d\d\d)\-\d$/)
    { pattern: /^(G)\-(\d\d\d)\-(\d)$/, message: "Removing visit code (?)", converter: this.removeVisitCode, idxArr: [1, 2, 3] },

    // "G123-7".match(/^(G)(\d\d\d)\-(\d)$/)
    { pattern: /^(G)(\d\d\d)\-(\d)$/, message: "Adding hyphen and removing visit code(?)", converter: this.removeVisitCode, idxArr: [1, 2, 3] },

    // "G123".match(/^(G)(\d\d\d)$/)
    { pattern: /^(G)(\d\d\d)$/, message: "Adding hyphen", converter: this.padHyphenate, idxArr: null },

    // "G-12-7".match(/^((G)\-(\d\d)\-(\d)$/)
    { pattern: /^(G)\-(\d\d)\-(\d)$/, message: "Removing visit code (?)", converter: this.removeVisitCode, idxArr: [1, 2, 3] },

    // "G12-7".match(/^(G)(\d\d)\-(\d)$/)
    { pattern: /^(G)(\d\d)\-(\d)$/, message: "Adding hyphen, converting to 3-digit ID, and removing visit code(?)", converter: this.removeVisitCode, idxArr: [1, 2, 3] },

    // "G12".match(/^(G)(\d\d)$/)
    { pattern: /^(G)(\d\d)$/, message: "Converting to 3-digit ID, adding hyphen", converter: this.padHyphenate, idxArr: null },


    // --- S-numbers ---
    // "S-1".match(/^(S-)(\d)$/)
    { pattern: /^(S)-(\d)$/, message: "Converting to 3-digit ID", converter: this.padHyphenate, idxArr: null },

    // "S-12".match(/^(S-)(\d\d)$/)
    { pattern: /^(S)-(\d\d)$/, message: "Converting to 3-digit ID", converter: this.padHyphenate, idxArr: null },

    // "S-0123".match(/^(S)\-0(\d\d\d)$/)
    { pattern: /^(S)\-0(\d\d\d)$/, message: "Removing extra leading 0 from start of ID", converter: this.padHyphenate, idxArr: null },

    // "S1".match(/^(S)(\d)$/)
    { pattern: /^(S)(\d)$/, message: "Converting to 3-digit ID, adding hyphen", converter: this.padHyphenate, idxArr: null },

    // "S12".match(/^(S)(\d\d)$/)
    { pattern: /^(S)(\d\d)$/, message: "Converting to 3-digit ID, adding hyphen", converter: this.padHyphenate, idxArr: null },

    // "S123".match(/^(S)(\d\d\d)$/)
    { pattern: /^(S)(\d\d\d)$/, message: "Adding hyphen", converter: this.padHyphenate, idxArr: null },

    { pattern: /^(S)(\d{7})$/, message: "Adding hyphen", converter: this.padHyphenate, idxArr: null },

    // "S0123".match(/^(S)0(\d\d\d)$/)
    { pattern: /^(S)0(\d\d\d)$/, message: "Removing first 0 from ID, adding hyphen", converter: this.padHyphenate, idxArr: null },

    // "S0123-7".match(/^(S)0(\d\d\d)\-(\d)$/)
    { pattern: /^(S)0(\d\d\d)\-(\d)$/, message: "Removing first 0 from ID, adding hyphen", converter: this.removeVisitCode, idxArr: [1, 2, 3] },

    // "S-0123-7".match(/^(S)\-0(\d\d\d)\-(\d)$/)
    { pattern: /^(S)\-0(\d\d\d)\-(\d)$/, message: "Removing first 0 from ID, adding hyphen", converter: this.removeVisitCode, idxArr: [1, 2, 3] },

    // "S7-0123".match(/^(S)(\d)\-0(\d\d\d)$/)
    { pattern: /^(S)(\d)\-0(\d\d\d)$/, message: "Removing first 0 from ID, adding hyphen", converter: this.removeVisitCode, idxArr: [1, 3, 2] },

    // "S-12-7".match(/^(S-)(\d\d)\-(\d)$/)
    { pattern: /^(S)\-(\d\d)\-(\d)$/, message: "Removing visit code (?), converting to 3-digit ID", converter: this.removeVisitCode, idxArr: [1, 2, 3] },

    // "S-123-7".match(/^(S)\-(\d\d\d)\-(\d)$/)
    { pattern: /^(S)\-(\d\d\d)\-(\d)$/, message: "Removing visit code (?)", converter: this.removeVisitCode, idxArr: [1, 2, 3] },

    // "S12-7".match(/^(S)(\d\d)\-(\d$/)
    { pattern: /^(S)(\d\d)\-(\d)$/, message: "Removing visit code (?), converting to 3-digit ID, adding hyphen", converter: this.removeVisitCode, idxArr: [1, 2, 3] },

    // "S123-7".match(/^(S)(\d\d\d)\-(\d)$/)
    { pattern: /^(S)(\d\d\d)\-(\d)$/, message: "Removing visit code (?), adding hyphen", converter: this.removeVisitCode, idxArr: [1, 2, 3] },

    // "S7-12".match(/^(S)\d-(\d\d)$/)
    { pattern: /^(S)(\d)-(\d\d)$/, message: "Removing visit code (?), converting to 3-digit ID", converter: this.removeVisitCode, idxArr: [1, 3, 2] },

    // "S7-123".match(/^(S)(\d)-(\d\d\d)$/)
    { pattern: /^(S)(\d)-(\d\d\d)$/, message: "Removing visit code (?)", converter: this.removeVisitCode, idxArr: [1, 3, 2] },

    // --- C-numbers ---
    // "C7-123-4".match(/^(C)(\d)-(\d\d\d\-\d)$/)
    { pattern: /^(C)(\d)-(\d\d\d\-\d)$/, message: "Removing visit code (?)", converter: this.removeVisitCode, idxArr: [1, 3, 2] },

    { pattern: /^(C)(\d{7})$/, message: "Adding hyphen", converter: this.padHyphenate, idxArr: null },

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
        fixed_id = weirdpattern['converter'](pattern_match, weirdpattern['idxArr']);
        return ({ status: 302, id: fixed_id['id'], timepoint: fixed_id['timepointID'], message: weirdpattern['message'] })
      }
    }

    // Otherwise: return an error
    return ({ status: 400, id: null, message: "Can't be converted: ID doesn't fit the expected patterns. Double check it." })
  }



  // Functions to convert unacceptable but predictable IDs into acceptable ones.
  padHyphenate(matchArr, idxArr, n: number) {
    if (matchArr[1] === "G") {
      // For G-ids, pad to four digits.
      n = 4;
    } else {
      n = 3;
    }
    // combine the two pieces of the regex match, separated by a hyphen
    return ({ id: `${matchArr[1]}-${matchArr[2].padStart(n, '0')}`, timepointID: null })
  }

  removeVisitCode(matchArr, idxArr, n: number) {
    // remove the visit code portion of the ID.
    // idxArr is a triple containing the indices to use to get the components:
    // idxArr[0] is the letter (G, S, C)
    // idxArr[1] is the three- or four-number ID. Note: for C-ids, will include the `-{contact number}`
    // idxArr[2] is the single digit visit code.
    if (matchArr[idxArr[0]] === "G") {
      // For G-ids, pad to four digits.
      n = 4;
    } else {
      n = 3;
    }

    return ({ id: `${matchArr[idxArr[0]]}\-${matchArr[idxArr[1]].padStart(n, '0')}`, timepointID: matchArr[idxArr[2]] })
  }

}

# Set of test functions for Acute patient data/metadata.
# Run via  python tests/test_acute_patients.py
# or python -m unittest discover -s tests

import unittest
import config
import os
from survivors.clean_ebola_survivors import import_ebola_survivors

class TestSum(unittest.TestCase):
    """
    Test extension is as expected
    """
    def test_file_ext(self):
        expected_file = ".xlsx"
        filename, filetype = os.path.splitext(config.input_ebolaSurvivor)
        self.assertEqual(filetype, expected_file)

    """
    Test the column names haven't changed.
    """
    def test_column_names(self):
        df_raw = import_ebola_survivors(config.input_ebolaSurvivor)

        expected_cols = {'ID number', 'study specific number', 'G number', 'age at diagnosis',
       'gender', 'district', 'village', 'rel between survivor anc contacts',
       'level/type of exposure', 'ebola IgG', 'lassa IgG', 'joint pain',
       'muscle pain', 'hearing loss', 'ringing in ears', 'dry eyes',
       'burning eyes', 'loss of vision', 'blurry vision', 'light sensitivity',
       'painful eyes', 'sensation of foreign body in eye'}
        set_diff1 = set(df_raw.columns) - expected_cols
        set_diff2 = expected_cols - set(df_raw.columns)

        if (len(set_diff1) > 0):
            print("Extra columns found: ")
            print(set_diff1)

        if (len(set_diff2) > 0):
            print("Missing expected columns: ")
            print(set_diff2)
        self.assertEqual(len(set_diff1) + len(set_diff2), 0)

    """
    Test patient IDs are unique
    """
    def test_unique_ids(self):
        df_raw = import_ebola_survivors(config.input_ebolaSurvivor)
        num_dupes = sum(df_raw.duplicated(subset="ID number"))

        self.assertEqual(num_dupes, 0)

    def test_unique_publicids(self):
        df_raw = import_ebola_survivors(config.input_ebolaSurvivor)
        num_dupes = sum(df_raw.duplicated(subset="study specific number"))

        self.assertEqual(num_dupes, 0)


if __name__ == '__main__':
    unittest.main()

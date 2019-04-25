# Set of test functions for Acute patient data/metadata.
# Run via  python tests/test_acute_patients.py
# or python -m unittest discover -s tests

import unittest

from acute_patients import df


class TestSum(unittest.TestCase):
    """
    Test the column names haven't changed.
    """

    """
    Test patient IDs are unique
    """

    def test_column_names(self):
        expected_cols = {'gid', 'ID', 'Agey', 'Agem', 'Aged', 'Sex_CN', 'evaldate_lba1',
                         'outcome_lba2', 'AdmitStatus', 'IllnessOnset', 'DateofDischarge',
                         'admit', 'agvresultcc1', 'igmvresultcc1', 'iggvresultcc1', 'groupcc1',
                         'group2cc1', 'groupcc2'}
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
    Test all GIDs follow the expected regex pattern
    """
    def test_check_gids(self):
        self.assertTrue()

    """
    test categories are all inclusive
    """

    def test_gender(self):
        """
        `gender` should be only Female, Male, or Unknown
        """
        cats = {"Female", "Male", "Unknown"}
        self.assertEqual(len(set(df.gender) - cats), 0)

    """
    Check all outputted types are as expected (array, etc.)
    """
    def test_required(self):
        self.assertItemsEqual()

    """
    automatically output weirdos.
    """

    """
    .assertEqual(a, b)	a == b
    .assertTrue(x)	bool(x) is True
    .assertFalse(x)	bool(x) is False
    .assertIs(a, b)	a is b
    .assertIsNone(x)	x is None
    .assertIn(a, b)	a in b
    .assertIsInstance(a, b)	isinstance(a, b)
    """


if __name__ == '__main__':
    unittest.main()

# def test_sum():
#     assert sum([1, 2, 3]) == 6, "Should be 6"
#
# if __name__ == "__main__":
#     test_sum()
#     print("Everything passed")

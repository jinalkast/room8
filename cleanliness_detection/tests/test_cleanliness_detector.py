import pytest
from PIL import Image
import os
from temp import CleanlinessDetector

# Define test image directory
TEST_IMAGE_DIR = "tests/test_images"

# Blacklist of items to exclude from the results
BLACKLIST = ["chair", "dining table"]

@pytest.fixture(scope="module", autouse=True)
def setup_test_images():
    """Ensure the test image directory exists and has test images."""
    os.makedirs(TEST_IMAGE_DIR, exist_ok=True)

@pytest.fixture
def detector():
    """Fixture to return an instance of CleanlinessDetector."""
    return CleanlinessDetector()

@pytest.mark.parametrize("before_img, after_img, expected", [
    # No changes
    ("before1.png", "after1.png", ([], [], [])),

    # 1 object added
    ("before2.png", "after2.png", (['laptop'], [], [])),

    # 1 object removed
    ("before3.png", "after3.png", ([], ['laptop'], [])),

    # 1 object moved
    ("before4.png", "after4.png", ([], [], ['laptop'])),

    # 1 object moved, 1 object removed
    ("before5.png", "after5.png", ([], ['handbag'], ['laptop'])),

    # 1 object added, 1 object moved
    ("before6.png", "after6.png", (['handbag'], [], ['laptop'])),

    # 1 object added, 1 object removed
    ("before7.png", "after7.png", (['laptop'], ['handbag'], [])),

    # 2 objects added, 1 object removed, 1 object moved
    ("before8.png", "after8.png", (['vase', 'potted plant'], ['handbag'], ['laptop'])),
])
def test_calculate_difference(detector, before_img, after_img, expected):
    """Test object detection and difference calculation using real images."""
    before_path = os.path.join(TEST_IMAGE_DIR, before_img)
    after_path = os.path.join(TEST_IMAGE_DIR, after_img)

    before_img = Image.open(before_path)
    after_img = Image.open(after_path)

    # Get original & highlighted versions
    before_orig, after_orig, _, _ = detector.combine_image_mask(
        before_img, after_img, display=False
    )

    # Calculate differences using original images
    added, removed, moved = detector.calculate_difference(before_orig, after_orig)

    # Convert moved objects to names for comparison
    added_names = [obj.class_name for obj in added]
    removed_names = [obj.class_name for obj in removed]
    moved_names = [obj[0][0].class_name for obj in moved]

    # Filter out blacklisted items
    added_names = [name for name in added_names if name.lower() not in BLACKLIST]
    removed_names = [name for name in removed_names if name.lower() not in BLACKLIST]
    moved_names = [name for name in moved_names if name.lower() not in BLACKLIST]

    # Assertions
    assert added_names == expected[0], f"Expected added: {expected[0]}, got {added_names}"
    assert removed_names == expected[1], f"Expected removed: {expected[1]}, got {removed_names}"
    assert moved_names == expected[2], f"Expected moved: {expected[2]}, got {moved_names}"

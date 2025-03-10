import pytest
from PIL import Image
import os
from ..temp import CleanlinessDetector

# Define test image directory
TEST_IMAGE_DIR = "tests/test_images"

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
    ("before.jpeg", "after_no_change.jpeg", ([], [], [])),

    # 1 object added
    ("before.jpeg", "after_added.jpeg", (['chair'], [], [])),

    # 1 object removed
    ("before.jpeg", "after_removed.jpeg", ([], ['table'], [])),

    # 1 object moved
    ("before.jpeg", "after_moved.jpeg", ([], [], ['sofa'])),

    # 1 object added, 1 object removed
    ("before.jpeg", "after_added_removed.jpeg", (['lamp'], ['desk'], [])),

    # 1 object added, 1 object moved
    ("before.jpeg", "after_added_moved.jpeg", (['cup'], [], ['book'])),

    # 1 object removed, 1 object moved
    ("before.jpeg", "after_removed_moved.jpeg", ([], ['plant'], ['stool'])),

    # 1 object added, 1 object removed, 1 object moved
    ("before.jpeg", "after_all.jpeg", (['bottle'], ['keyboard'], ['monitor'])),
])
def test_calculate_difference(detector, before_img, after_img, expected):
    """Test object detection and difference calculation using real images."""
    before_path = os.path.join(TEST_IMAGE_DIR, before_img)
    after_path = os.path.join(TEST_IMAGE_DIR, after_img)

    before_img = Image.open(before_path)
    after_img = Image.open(after_path)

    # Get original & highlighted versions
    before_orig, after_orig, before_highlighted, after_highlighted = detector.combine_image_mask(
        before_img, after_img, display=False
    )

    # Object detection using highlighted images
    objects_before = detector.detect_objects(before_highlighted, True)
    objects_after = detector.detect_objects(after_highlighted, True)

    # Calculate differences using original images
    added, removed, moved = detector.calculate_difference(before_orig, after_orig)

    # Convert moved objects to names for comparison
    moved_names = [obj[0] for obj in moved]

    # Assertions
    assert added == expected[0], f"Expected added: {expected[0]}, got {added}"
    assert removed == expected[1], f"Expected removed: {expected[1]}, got {removed}"
    assert moved_names == expected[2], f"Expected moved: {expected[2]}, got {moved_names}"

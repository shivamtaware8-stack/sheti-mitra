import gc
import json
from pathlib import Path

import timm
import torch
from huggingface_hub import hf_hub_download

ROOT = Path(__file__).resolve().parents[1]
MODEL_DIR = ROOT / "models"
INPUT_SIZE = 224
MEAN = [0.485, 0.456, 0.406]
STD = [0.229, 0.224, 0.225]

MODELS = {
    "grape": {
        "repository": "ixrbhii/grape-disease-convnext",
        "version": "ixrbhii-grape-disease-convnext",
        "translations": {
            "Anthracnose": ("अँथ्रॅक्नोज", "एन्थ्रेक्नोज"),
            "Bacterial Rot": ("जिवाणू कुज", "बैक्टीरियल रॉट"),
            "Black Rot": ("काळी कुज", "ब्लैक रॉट"),
            "Brown Spot": ("तपकिरी ठिपके", "भूरे धब्बे"),
            "Downy Mildew": ("डाउनी मिल्ड्यू", "डाउनी मिल्ड्यू"),
            "Esca Black Measles": ("एस्का रोग", "एस्का ब्लैक मीजल्स"),
            "Healthy": ("निरोगी", "स्वस्थ"),
            "Leaf Blight": ("पान करपा", "पत्ती झुलसा"),
            "Mites": ("माइट्स", "माइट्स"),
            "Powdery Mildew": ("भुरी", "पाउडरी मिल्ड्यू"),
            "Shot Hole": ("छिद्र ठिपके", "शॉट होल"),
        },
    },
    "soybean": {
        "repository": "ixrbhii/soybean-disease-convnext",
        "version": "ixrbhii-soybean-disease-convnext",
        "translations": {
            "Downy Mildew": ("डाउनी मिल्ड्यू", "डाउनी मिल्ड्यू"),
            "Frogeye Leaf Spot": ("फ्रॉग-आय पानांचे ठिपके", "फ्रॉग-आई पत्ती धब्बा"),
            "Healthy": ("निरोगी", "स्वस्थ"),
            "Mosaic Virus": ("मोझॅक विषाणू", "मोज़ेक वायरस"),
            "Rust": ("तांबेरा", "रतुआ"),
            "Septoria Brown Spot": ("सेप्टोरिया तपकिरी ठिपके", "सेप्टोरिया भूरे धब्बे"),
        },
    },
}


def slug(label):
    return "_".join("".join(char.lower() if char.isalnum() else " " for char in label).split())


def export_model(crop, spec):
    repository = spec["repository"]
    config_path = hf_hub_download(repository, "config.json")
    config = json.loads(Path(config_path).read_text(encoding="utf-8"))
    class_names = config.get("label_names", [])
    if not class_names or any(name not in spec["translations"] for name in class_names):
        raise ValueError(f"Unexpected or untranslated class list for {repository}")

    model = timm.create_model(f"hf-hub:{repository}", pretrained=True).cpu().eval()
    if model.get_classifier().out_features != len(class_names):
        raise ValueError(f"Classifier and labels disagree for {repository}")

    output_path = MODEL_DIR / f"{crop}-convnext.onnx"
    sample = torch.zeros((1, 3, INPUT_SIZE, INPUT_SIZE), dtype=torch.float32)
    torch.onnx.export(
        model,
        sample,
        str(output_path),
        input_names=["input"],
        output_names=["logits"],
        dynamic_axes={"input": {0: "batch"}, "logits": {0: "batch"}},
        opset_version=17,
        dynamo=False,
    )

    classes = []
    for label in class_names:
        mr, hi = spec["translations"][label]
        classes.append({
            "key": f"{crop}_{slug(label)}",
            "crop": crop,
            "healthy": label.lower() == "healthy",
            "name": {"mr": mr, "hi": hi, "en": label},
        })

    manifest = {
        "model": spec["version"],
        "repository": repository,
        "license": "CC-BY-4.0",
        "inputSize": INPUT_SIZE,
        "preprocess": "center-crop",
        "mean": MEAN,
        "std": STD,
        "classes": classes,
    }
    (MODEL_DIR / f"{crop}-labels.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    del model, sample
    gc.collect()
    print(f"Exported {crop}: {output_path} ({len(classes)} classes)")


def main():
    torch.set_num_threads(1)
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    for crop, spec in MODELS.items():
        export_model(crop, spec)


if __name__ == "__main__":
    main()

from build.cvisb_index_utilities import create_indices, delete_public_indices
from build.cvisb_public_document_transform import public_document_transform_function 

delete_public_indices()
print("Creating public indices ... ")
# Create public indices
create_indices({
    "patient": {
        "public_alias": "patient_metadata_public_current", 
        "create_public_index": True, 
        "transfer_data": True,
        "public_document_transform_function": public_document_transform_function 
    },
    "sample": {
        "public_alias": "sample_metadata_public_current", 
        "create_public_index": True, 
        "transfer_data": True,
        "public_document_transform_function": public_document_transform_function 
    }, 
    "experiment": {
        "public_alias": "experiment_metadata_public_current", 
        "create_public_index": True, 
        "transfer_data": True,
        "public_document_transform_function": public_document_transform_function 
    }, 
    "datacatalog": {
        "public_alias": "datacatalog_metadata_public_current", 
        "create_public_index": True, 
        "transfer_data": True,
        "public_document_transform_function": public_document_transform_function 
    }, 
    "datadownload": {
        "public_alias": "datadownload_metadata_public_current", 
        "create_public_index": True, 
        "transfer_data": True,
        "public_document_transform_function": public_document_transform_function 
    }, 
    "dataset": {
        "public_alias": "dataset_metadata_public_current", 
        "create_public_index": True, 
        "transfer_data": True,
        "public_document_transform_function": public_document_transform_function 
    }
})
print("Finished")


import { Button } from "@/components/ui/button";
import { SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import { Fragment } from "react";
import ProductImageUpload from "./image-upload";

const initialFormaData={
    image:null,
    title:'',
    description:'',
    category:'',
    brand :'',
    price:"",
    salePrice:'',
    salePrice:'',
    toolStock:'', 

}

function AdminProducts() {
    const [openCreateProductsDialog,setOpenCreateProductsDialog]=
    useState(false);
    const[formData,setFormData]=useState(initialFormaData)
    const[imageFile,setImageFile]=useState(null);
    const[uploadedImageUrl,setUploadedImageUrl]=useState('')
    const[imageloadingState,setImageLoadingState]=useState(false)

    function onSubmit(){

    }
    console.log(formData,'formData');
    

    return(<Fragment>
        <div className="mb-5 w-full flex justify-end">
        <Button onClick={()=>setOpenCreateProductsDialog(true)}>Add New Products</Button>
        </div>
        <div className="grid gap-4md:grid-cols-3 lg:grid-cols-4"></div>
    <Sheet open={openCreateProductsDialog}onOpenChange={()=>{
        setOpenCreateProductsDialog(false);
    }}>
        <SheetContent side="right" className="overflow-auto">
            <SheetHeader>
                <SheetTitle>Add New Product</SheetTitle>
            </SheetHeader>
            <ProductImageUpload></ProductImageUpload>
           
            <productImageUpload
             imagefile={imageFile} 
            setImageFile={setImageFile} 
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setimageloadingState={setImageLoadingState}
            />
            <div className="py-6">
                <CommonForm 
                onSubmit={onSubmit}
                formData={formData} 
                setFormData={setFormData}
                buttonText="Add"
            formControls={addProductFomElements

            }/>
            </div>
        </SheetContent>
    </Sheet>
    </Fragment>
    );
        
   
    
}
export default AdminProducts;

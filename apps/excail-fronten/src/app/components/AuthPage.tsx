import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
import { AuthTabs } from "./Authtabs";
  
  export function SignInDialog() {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">Sign In</Button>
        </DialogTrigger>
  
        <DialogContent>
            <AuthTabs/>
        </DialogContent>
      </Dialog>
    );
  }
  
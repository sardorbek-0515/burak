import ViewModel from "../schema/View.model";
type ViewInput = {
    memberId: string;
    viewRefId: string;
};
import Errors, { HttpCode, Message } from "../libs/Errors";
class ViewService {
    private readonly viewModel;

    constructor() {
        this.viewModel = ViewModel;
    }

}

export default ViewService;
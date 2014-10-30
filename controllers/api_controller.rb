class ApiController < ActionController::Base

  def updateUserStageData

    begin
      if request.xhr? && current_user.present?
        stageNum = params[:stageNum].to_i
        if current_user.stage < stageNum + 1
          current_user.stage = stageNum + 1 
          current_user.save
        end

        UserBlock.add_user_block(current_user.id,stageNum)

        render :json => {response: "ok"}.to_json
      else
        render :text => "something go wrong"
      end

    rescue => e
      render :json => {response: "ng"}.to_json
    end

  end

end

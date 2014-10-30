class Block < ActiveRecord::Base
  def self.get_block_info block_ids
    block_info = Block.where(id:block_ids)
    return block_info
  end
end
